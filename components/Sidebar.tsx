import React from 'react';
import { MessageSquare, Plus, Settings, Menu, X, Cpu, Github, Disc, Sparkles } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  startNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, startNewChat }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[280px] bg-black border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-[260px]'}
      `}>
        
        {/* Header */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={startNewChat}>
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-t from-gray-900 to-gray-800 border border-white/10 flex items-center justify-center shadow-lg group-hover:shadow-white/5 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-y-full group-hover:-translate-y-full transition-transform duration-700" />
              <Sparkles className="w-4 h-4 text-gray-300" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-metallic">
              Titanium
            </span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-1 text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 mb-4">
          <button 
            onClick={startNewChat}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-sm text-gray-200 transition-all duration-300 group shadow-inner"
          >
            <Plus size={16} className="text-gray-400 group-hover:text-white transition-colors" />
            <span className="font-medium tracking-wide">New Chat</span>
          </button>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <div className="px-2 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
            History
          </div>
          
          {[
            "Quantum Physics Intro", 
            "Code Optimization", 
            "Titanium Properties",
            "Dark Mode Design",
            "System Architecture"
          ].map((title, i) => (
            <button 
              key={i}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 text-left truncate group border border-transparent hover:border-white/5"
            >
              <MessageSquare size={14} className="flex-shrink-0 text-gray-600 group-hover:text-gray-300 transition-colors" />
              <span className="truncate opacity-80 group-hover:opacity-100">{title}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 mt-auto bg-black">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-300">U</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-medium text-white">User</span>
              <span className="text-[10px] text-gray-600">Premium</span>
            </div>
          </button>
          <div className="flex items-center justify-between mt-3 px-1">
             <button className="p-2 text-gray-600 hover:text-white transition-colors">
                <Settings size={16} />
             </button>
             <button className="p-2 text-gray-600 hover:text-white transition-colors">
                <Github size={16} />
             </button>
             <div className="text-[10px] text-gray-700 font-mono">v2.0</div>
          </div>
        </div>
      </div>
    </>
  );
};