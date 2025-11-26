import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, Role } from "../types";

const API_KEY = process.env.API_KEY || '';

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    client = new GoogleGenAI({ apiKey: API_KEY });
  }
  return client;
};

export const createChatSession = (): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "You are Titanium AI, a helpful, precise, and sophisticated AI assistant. You prefer concise, technically accurate answers. You have a cool, calm personality.",
    },
  });
};

export const sendMessageStream = async (
  chat: Chat, 
  message: string, 
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const resultStream = await chat.sendMessageStream({ message });
    
    let fullText = '';
    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      const text = c.text || '';
      fullText += text;
      onChunk(text);
    }
    return fullText;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
