import React, { useState } from 'react';
import { Search, ArrowRight, Globe, Image, Zap } from 'lucide-react';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchSection({ onSearch, isLoading }: SearchSectionProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 pt-20 pb-10">
      <h1 className="text-4xl md:text-5xl font-medium text-center mb-12 tracking-tight">
        What do you want to know?
      </h1>
      
      <form 
        onSubmit={handleSubmit}
        className="relative group"
      >
        <div className="relative flex items-center bg-white border border-[#e5e5e0] rounded-2xl shadow-sm group-focus-within:shadow-md group-focus-within:border-[#d5d5d0] transition-all p-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-transparent border-none focus:ring-0 text-lg py-3 px-4 resize-none min-h-[60px] max-h-[200px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex items-center gap-2 pr-2">
            <button 
              type="submit"
              disabled={!query.trim() || isLoading}
              className="p-2 bg-black text-white rounded-xl disabled:opacity-30 transition-opacity hover:bg-gray-800"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-4 px-2">
          <button type="button" className="flex items-center gap-2 text-sm text-[#666660] hover:text-black transition-colors">
            <Globe size={16} />
            <span>Focus</span>
          </button>
          <button type="button" className="flex items-center gap-2 text-sm text-[#666660] hover:text-black transition-colors">
            <Plus size={16} />
            <span>Attach</span>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" className="flex items-center gap-2 text-sm text-[#666660] hover:text-black transition-colors">
              <Zap size={16} className="text-orange-500" />
              <span>Pro</span>
            </button>
          </div>
        </div>
      </form>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "How to build a SaaS in 2024?",
          "Explain quantum entanglement simply",
          "Best weekend trips from London",
          "Latest news in AI space"
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setQuery(suggestion);
              onSearch(suggestion);
            }}
            className="text-left p-4 bg-white border border-[#e5e5e0] rounded-xl hover:bg-[#f3f3ee] transition-colors text-sm text-[#1a1a1a]"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function Plus({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
