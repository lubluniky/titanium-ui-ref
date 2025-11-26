import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Role, Message } from '../types';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, Check, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`group w-full text-gray-100 ${isModel ? 'py-6 md:py-8' : 'py-6 md:py-8'}`}>
      <div className="max-w-3xl mx-auto px-4 flex gap-4 md:gap-6">
        
        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col relative items-end">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isModel 
              ? 'bg-transparent border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
              : 'bg-neutral-800'
          }`}>
            {isModel ? (
               <Sparkles size={14} className="text-white animate-pulse-slow" />
            ) : (
               <div className="text-[10px] font-bold text-gray-300">YOU</div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-hidden">
          <div className="font-semibold text-xs tracking-wide text-gray-500 mb-2 uppercase">
            {isModel ? 'Titanium' : 'User'}
          </div>
          
          <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-white/10 max-w-none text-[15px] md:text-[16px] text-gray-200/90 font-light">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  return !inline ? (
                    <div className="rounded-lg overflow-hidden my-6 border border-white/10 bg-[#0a0a0a] shadow-2xl">
                      <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">Code Block</span>
                      </div>
                      <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300">
                        <code {...props} className={className}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-white/90" {...props}>
                      {children}
                    </code>
                  );
                },
                strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                a: ({children, href}) => <a href={href} className="text-blue-400 hover:text-blue-300 underline underline-offset-4">{children}</a>
              }}
            >
              {message.text}
            </ReactMarkdown>
            
            {/* Blinking Cursor for streaming */}
            {isModel && message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 align-middle bg-white/70 animate-pulse rounded-[1px]" />
            )}
          </div>

          {/* Action Bar (Only for Model) */}
          {isModel && !message.isStreaming && (
            <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button className="p-1.5 rounded-md hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                <ThumbsUp size={14} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};