'use client';

import { useEffect, useState, useMemo } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { NewsCardSkeleton } from '@/components/NewsCardSkeleton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchFilter } from '@/components/SearchFilter';
import type { NewsItem, NewsResponse } from '@/types/news';

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<NewsResponse['sources']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data: NewsResponse = await response.json();
      setNews(data.items);
      setSources(data.sources);
      setLastUpdated(data.fetchedAt);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Get unique sources from news items
  const availableSources = useMemo(() => {
    const sourceSet = new Set(news.map(item => item.source));
    return Array.from(sourceSet).sort();
  }, [news]);

  // Filter news based on search and source
  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSource = !selectedSource || item.source === selectedSource;
      
      return matchesSearch && matchesSource;
    });
  }, [news, searchQuery, selectedSource]);

  const resultsCount = filteredNews.length;
  const isFiltered = searchQuery || selectedSource;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              🤖 AI News Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Live updates from HN, Reddit & AI blogs
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchNews}
              disabled={loading}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              aria-label="Refresh"
            >
              <svg 
                className={`w-5 h-5 text-gray-700 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <SearchFilter
          onSearch={setSearchQuery}
          onFilterSource={setSelectedSource}
          sources={availableSources}
          selectedSource={selectedSource}
        />

        {/* Source status */}
        {sources.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {sources.map((source) => (
              <span
                key={source.name}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  source.status === 'ok'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {source.name}: {source.count}
              </span>
            ))}
            {lastUpdated && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                Updated: {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>
        )}

        {/* Results count when filtered */}
        {isFiltered && !loading && (
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
            {searchQuery && <span> for &quot;{searchQuery}&quot;</span>}
            {selectedSource && <span> from {selectedSource}</span>}
          </div>
        )}

        {error ? (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchNews}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {loading && news.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))
              : filteredNews.map((item) => <NewsCard key={item.id} item={item} />)}
          </div>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="text-center py-12">
            {isFiltered ? (
              <>
                <p className="text-gray-500 dark:text-gray-400">No results match your filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSource(null);
                  }}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-500 dark:text-gray-400">No AI news found right now</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try refreshing in a few minutes</p>
              </>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Built with Next.js, TypeScript & Tailwind CSS • Data from HN, Reddit & AI blogs
        </div>
      </footer>
    </div>
  );
}
