import React from 'react';
import { Search, Home, Globe, Library, Plus, Settings, MessageSquare } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNewThread: () => void;
  history: Array<{ id: number, query: string }>;
  onHistoryClick: (query: string) => void;
}

export default function Sidebar({ isOpen, setIsOpen, onNewThread, history, onHistoryClick }: SidebarProps) {
  const navItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Globe, label: 'Discover', active: false },
    { icon: Library, label: 'Library', active: false },
  ];


  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#f3f3ee] border-r border-[#e5e5e0] transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 -translate-x-full md:w-20 md:translate-x-0"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div className={cn("flex items-center gap-2 font-bold text-xl overflow-hidden transition-opacity", !isOpen && "md:opacity-0")}>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
            <Search size={18} />
          </div>
          <span className="whitespace-nowrap">InsightSearch</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-[#e8e8e3] rounded-lg md:hidden"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="px-3 py-2">
        <button 
          onClick={onNewThread}
          className="w-full flex items-center gap-3 px-3 py-2 bg-white border border-[#e5e5e0] rounded-full shadow-sm hover:shadow-md transition-all text-sm font-medium"
        >
          <Plus size={18} />
          <span className={cn("transition-opacity", !isOpen && "md:hidden")}>New Thread</span>
          {!isOpen && <span className="hidden md:block mx-auto"><Plus size={18} /></span>}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              item.active ? "bg-[#e8e8e3] text-black" : "text-[#666660] hover:bg-[#e8e8e3] hover:text-black"
            )}
          >
            <item.icon size={20} />
            <span className={cn("transition-opacity", !isOpen && "md:hidden")}>{item.label}</span>
          </a>
        ))}

        <div className="pt-8 pb-2">
          <p className={cn("px-3 text-[10px] font-bold text-[#999995] uppercase tracking-wider transition-opacity", !isOpen && "md:hidden")}>
            Recent
          </p>
        </div>
        
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onHistoryClick(item.query)}
            className={cn(
              "flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm text-[#666660] hover:bg-[#e8e8e3] hover:text-black transition-colors truncate",
              !isOpen && "md:hidden"
            )}
          >
            <MessageSquare size={16} className="shrink-0" />
            <span className="truncate">{item.query}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#e5e5e0]">
        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[#666660] hover:bg-[#e8e8e3] rounded-lg transition-colors">
          <Settings size={20} />
          <span className={cn("transition-opacity", !isOpen && "md:hidden")}>Settings</span>
        </button>
      </div>
    </aside>
  );
}
