import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MessageBubble } from './components/MessageBubble';
import { Message, Role } from './types';
import { createChatSession, sendMessageStream } from './services/geminiService';
import { Send, Menu, Loader2, Paperclip, Mic, ArrowUp, ChevronDown, Check, Sparkles, Zap, Brain } from 'lucide-react';
import { Chat } from '@google/genai';

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: Role.MODEL,
  text: "I am Titanium. Ready when you are.",
  timestamp: Date.now()
};

type ModelId = 'gemini-3-pro' | 'claude-4.5-opus' | 'grok-4.1-heavy';

interface AIModel {
  id: ModelId;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const MODELS: AIModel[] = [
  { 
    id: 'gemini-3-pro', 
    name: 'Gemini 3 Pro', 
    icon: Sparkles, 
    description: 'DeepMind • High Reasoning',
    color: 'text-blue-400'
  },
  { 
    id: 'claude-4.5-opus', 
    name: 'Claude 4.5 Opus', 
    icon: Brain, 
    description: 'Anthropic • Creative',
    color: 'text-orange-400'
  },
  { 
    id: 'grok-4.1-heavy', 
    name: 'Grok 4.1 Heavy', 
    icon: Zap, 
    description: 'xAI • Unfiltered',
    color: 'text-white'
  },
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Model Selection State
  const [selectedModel, setSelectedModel] = useState<AIModel>(MODELS[0]);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  // Refs for Chat and Scrolling
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Chat Session
  useEffect(() => {
    chatSessionRef.current = createChatSession();
  }, []);

  // Close model menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
        setIsModelMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Input Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  const handleStartNewChat = () => {
    setMessages([]);
    chatSessionRef.current = createChatSession();
    setSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !chatSessionRef.current) return;

    const userMessageText = inputText.trim();
    setInputText('');
    
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: userMessageText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Create placeholder for AI response
    const aiMsgId = (Date.now() + 1).toString();
    const aiMsgPlaceholder: Message = {
      id: aiMsgId,
      role: Role.MODEL,
      text: '',
      timestamp: Date.now(),
      isStreaming: true
    };

    setMessages(prev => [...prev, aiMsgPlaceholder]);

    try {
      await sendMessageStream(
        chatSessionRef.current,
        userMessageText,
        (chunkText) => {
          setMessages(prev => prev.map(msg => {
            if (msg.id === aiMsgId) {
              return { ...msg, text: msg.text + chunkText };
            }
            return msg;
          }));
        }
      );
    } catch (error) {
      setMessages(prev => prev.map(msg => {
        if (msg.id === aiMsgId) {
          return { 
            ...msg, 
            text: msg.text + "\n\n*[Connection Severed. Re-initializing protocol...]*" 
          };
        }
        return msg;
      }));
    } finally {
      setIsLoading(false);
      setMessages(prev => prev.map(msg => {
        if (msg.id === aiMsgId) {
          return { ...msg, isStreaming: false };
        }
        return msg;
      }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-100 overflow-hidden font-sans selection:bg-white/20">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-noise absolute inset-0 z-[1]" />
        {/* Dynamic Glow Orb */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] animate-spotlight opacity-40 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gray-700/10 rounded-full blur-[100px] animate-pulse-slow opacity-30 mix-blend-screen" />
      </div>

      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        startNewChat={handleStartNewChat}
      />

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        
        {/* Unified Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            
            {/* Model Selector */}
            <div className="relative" ref={modelMenuRef}>
              <button 
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-200 group border border-transparent hover:border-white/5"
              >
                <span className={`flex items-center justify-center w-5 h-5 ${selectedModel.color} opacity-80 group-hover:opacity-100`}>
                  <selectedModel.icon size={16} />
                </span>
                <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                  {selectedModel.name}
                </span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isModelMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isModelMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#09090b] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50 ring-1 ring-white/5">
                  <div className="p-1.5 space-y-0.5">
                    {MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model);
                          setIsModelMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
                          selectedModel.id === model.id 
                            ? 'bg-white/10' 
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className={`p-2 rounded-md ${selectedModel.id === model.id ? 'bg-black/40' : 'bg-white/5 group-hover:bg-black/40'} transition-colors`}>
                          <model.icon size={18} className={model.color} />
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${selectedModel.id === model.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                            {model.name}
                          </div>
                          <div className="text-[11px] text-gray-500 font-medium tracking-wide">
                            {model.description}
                          </div>
                        </div>
                        {selectedModel.id === model.id && (
                          <Check size={16} className="text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side Actions (Mobile) */}
          <div className="lg:hidden">
             {/* Could add new chat button here for mobile if needed */}
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in select-none">
               {/* Massive Logo */}
               <div className="relative mb-8">
                 <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-gray-100 to-gray-600 animate-shimmer bg-[length:200%_auto]">
                   TITANIUM
                 </h1>
                 <div className="absolute -inset-1 blur-2xl bg-white/5 rounded-full -z-10 opacity-50" />
               </div>
               
               <p className="text-gray-500 max-w-md text-sm md:text-base font-light tracking-wide uppercase opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards] flex items-center justify-center gap-2">
                 <span>Running on</span>
                 <span className={`font-semibold ${selectedModel.color} drop-shadow-md`}>{selectedModel.name}</span>
               </p>

               {/* Quick Starters */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-12 w-full max-w-2xl opacity-0 animate-[fadeIn_1s_ease-out_0.8s_forwards]">
                  {["Explain Quantum Entanglement", "Write a Python Script", "Analyze Market Trends", "Debug React Component"].map((t, i) => (
                    <button key={i} onClick={() => { setInputText(t); }} className="px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-gray-100 text-sm transition-all duration-300 hover:scale-[1.01] hover:border-white/10 text-left">
                      {t}
                    </button>
                  ))}
               </div>
            </div>
          ) : (
            <div className="flex flex-col pb-4 w-full">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 pb-6 md:p-6 z-20 w-full flex justify-center bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="w-full max-w-3xl relative">
            <div className="relative group bg-neutral-900/60 backdrop-blur-2xl border border-white/10 focus-within:border-white/20 rounded-[2rem] shadow-2xl transition-all duration-300 overflow-hidden">
              
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${selectedModel.name}...`}
                rows={1}
                className="w-full bg-transparent text-gray-100 placeholder-gray-500 px-6 py-4 pr-14 rounded-[2rem] focus:outline-none resize-none max-h-[200px] leading-relaxed scrollbar-hide text-[16px]"
                disabled={isLoading}
              />

              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                 {inputText.length === 0 && (
                   <button className="p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
                     <Paperclip size={18} />
                   </button>
                 )}

                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                    ${inputText.trim() && !isLoading 
                      ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                      : 'bg-white/5 text-gray-600 cursor-not-allowed'}
                  `}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowUp size={20} />}
                </button>
              </div>
            </div>
            
            <div className="text-center mt-3">
              <p className="text-[10px] text-gray-600 tracking-wider">
                TITANIUM AI // {selectedModel.name.toUpperCase()} // ENCRYPTED
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;