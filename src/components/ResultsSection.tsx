import React from 'react';
import Markdown from 'react-markdown';
import { SearchResponse } from '../services/geminiService';
import { Share2, MoreHorizontal, ThumbsUp, ThumbsDown, RefreshCw, Layers, ExternalLink, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsSectionProps {
  query: string;
  response: SearchResponse | null;
  isLoading: boolean;
  onRetry: () => void;
  onSearch: (query: string) => void;
}

export default function ResultsSection({ query, response, isLoading, onRetry, onSearch }: ResultsSectionProps) {
  if (isLoading && !response) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-10 space-y-8">
        <h1 className="text-3xl font-medium">{query}</h1>
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-32 bg-gray-100 rounded w-full mt-8"></div>
        </div>
      </div>
    );
  }

  if (!response) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto w-full px-4 py-10 space-y-8"
    >
      <h1 className="text-3xl font-medium">{query}</h1>

      {/* Sources */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#666660]">
          <Layers size={16} />
          <span>Sources</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {response.sources.slice(0, 4).map((source, i) => (
            <a 
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white border border-[#e5e5e0] rounded-lg hover:bg-[#f3f3ee] transition-all group"
            >
              <p className="text-xs font-medium line-clamp-1 mb-1">{source.title}</p>
              <div className="flex items-center gap-1 text-[10px] text-[#999995]">
                <span className="truncate">{new URL(source.url).hostname}</span>
                <span className="text-[#e5e5e0]">•</span>
                <span>{i + 1}</span>
              </div>
            </a>
          ))}
          {response.sources.length > 4 && (
            <button className="p-3 bg-white border border-[#e5e5e0] rounded-lg hover:bg-[#f3f3ee] transition-all flex items-center justify-center gap-2 text-xs font-medium text-[#666660]">
              View {response.sources.length - 4} more
            </button>
          )}
        </div>
      </section>

      {/* Answer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#666660]">
          <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-[10px]">
            AI
          </div>
          <span>Answer</span>
        </div>
        <div className="markdown-body prose prose-sm max-w-none">
          <Markdown>{response.answer}</Markdown>
        </div>
        
        <div className="flex items-center gap-4 pt-4 border-t border-[#e5e5e0]">
          <button className="p-2 hover:bg-[#f3f3ee] rounded-lg text-[#666660] transition-colors">
            <Share2 size={18} />
          </button>
          <button className="p-2 hover:bg-[#f3f3ee] rounded-lg text-[#666660] transition-colors">
            <RefreshCw size={18} />
          </button>
          <div className="flex items-center gap-1 ml-auto">
            <button className="p-2 hover:bg-[#f3f3ee] rounded-lg text-[#666660] transition-colors">
              <ThumbsUp size={18} />
            </button>
            <button className="p-2 hover:bg-[#f3f3ee] rounded-lg text-[#666660] transition-colors">
              <ThumbsDown size={18} />
            </button>
            <button className="p-2 hover:bg-[#f3f3ee] rounded-lg text-[#666660] transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="space-y-4 pt-8 pb-20">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#666660]">
          <RefreshCw size={16} />
          <span>Related</span>
        </div>
        <div className="space-y-2">
          {response.relatedQuestions.map((q, i) => (
            <button 
              key={i}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onSearch(q);
              }}
              className="w-full text-left p-4 bg-white border border-[#e5e5e0] rounded-xl hover:bg-[#f3f3ee] hover:border-[#d5d5d0] transition-all text-sm text-[#1a1a1a] flex items-center justify-between group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <Search size={14} className="text-[#999995] group-hover:text-black transition-colors" />
                <span className="font-medium">{q}</span>
              </div>
              <Plus size={16} className="text-[#999995] group-hover:text-black transition-colors" />
            </button>
          ))}
        </div>
      </section>
    </motion.div>
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
