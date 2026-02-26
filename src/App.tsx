import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SearchSection from './components/SearchSection';
import ResultsSection from './components/ResultsSection';
import { performSearch, SearchResponse } from './services/geminiService';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ id: number, query: string }>>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const saveToHistory = async (query: string) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      fetchHistory();
    } catch (err) {
      console.error('Failed to save history', err);
    }
  };

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    setIsLoading(true);
    setError(null);
    setSearchResponse(null);

    try {
      const result = await performSearch(query);
      setSearchResponse(result);
      saveToHistory(query);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewThread = () => {
    setCurrentQuery('');
    setSearchResponse(null);
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-[#fcfcf9]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onNewThread={handleNewThread}
        history={history}
        onHistoryClick={handleSearch}
      />
      
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-[60] p-2 bg-white border border-[#e5e5e0] rounded-lg md:hidden"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {!currentQuery && !isLoading ? (
          <SearchSection onSearch={handleSearch} isLoading={isLoading} />
        ) : (
          <div className="min-h-screen">
            <ResultsSection 
              query={currentQuery} 
              response={searchResponse} 
              isLoading={isLoading} 
              onRetry={() => handleSearch(currentQuery)}
              onSearch={handleSearch}
            />
            
            {/* Sticky Search Bar at bottom when results are shown */}
            {!isLoading && searchResponse && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#fcfcf9] via-[#fcfcf9] to-transparent">
                <div className={`max-w-3xl mx-auto transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                   <div className="relative flex items-center bg-white border border-[#e5e5e0] rounded-2xl shadow-lg p-2">
                    <input
                      type="text"
                      placeholder="Ask a follow-up..."
                      className="w-full bg-transparent border-none focus:ring-0 py-2 px-4"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button className="p-2 bg-[#f3f3ee] text-[#666660] rounded-xl hover:bg-[#e8e8e3] transition-colors">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
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
