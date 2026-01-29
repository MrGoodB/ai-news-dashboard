'use client';

import { useState } from 'react';
import type { NewsItem } from '@/types/news';

interface QuickActionsProps {
  hotItems: NewsItem[];
  onShareDigest: () => void;
}

export function QuickActions({ hotItems, onShareDigest }: QuickActionsProps) {
  const [opening, setOpening] = useState(false);

  const openAllHot = () => {
    if (hotItems.length === 0) return;
    setOpening(true);
    
    // Open each hot article in a new tab with slight delay
    hotItems.forEach((item, index) => {
      setTimeout(() => {
        window.open(item.url, '_blank');
      }, index * 300);
    });

    setTimeout(() => setOpening(false), hotItems.length * 300 + 500);
  };

  if (hotItems.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={openAllHot}
        disabled={opening}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium text-sm hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
      >
        {opening ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Opening...
          </>
        ) : (
          <>
            🔥 Open All Hot ({hotItems.length})
          </>
        )}
      </button>

      <button
        onClick={onShareDigest}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
      >
        📤 Share Digest
      </button>
    </div>
  );
}
