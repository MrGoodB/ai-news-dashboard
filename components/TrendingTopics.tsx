'use client';

import type { TrendingTopic } from '@/types/news';

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  onTopicClick: (topic: string) => void;
  activeTopic?: string | null;
}

export function TrendingTopics({ topics, onTopicClick, activeTopic }: TrendingTopicsProps) {
  if (topics.length === 0) return null;

  // Sort to show high priority first
  const sortedTopics = [...topics].sort((a, b) => {
    if (a.isHighPriority && !b.isHighPriority) return -1;
    if (!a.isHighPriority && b.isHighPriority) return 1;
    return b.weight - a.weight;
  });

  return (
    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/30">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔥</span>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Trending Topics
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          (Claude & Agents prioritized)
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedTopics.map((topic) => {
          const isActive = activeTopic?.toLowerCase() === topic.term.toLowerCase();
          const fontSize = Math.max(12, Math.min(20, 12 + topic.weight * 10));
          const opacity = Math.max(0.6, topic.weight);
          
          return (
            <button
              key={topic.term}
              onClick={() => onTopicClick(isActive ? '' : topic.term)}
              className={`
                px-3 py-1.5 rounded-full font-medium transition-all duration-200
                hover:scale-105 hover:shadow-md
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : topic.isHighPriority
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
                }
              `}
              style={{ 
                fontSize: `${fontSize}px`,
                opacity: isActive ? 1 : opacity,
              }}
            >
              {topic.isHighPriority && !isActive && '⭐ '}
              {topic.term}
              <span className={`ml-1 text-xs ${isActive || topic.isHighPriority ? 'text-white/70' : 'text-gray-400'}`}>
                {topic.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
