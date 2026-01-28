import type { NewsItem } from '@/types/news';
import { fetchHackerNews } from './hackernews';
import { fetchReddit } from './reddit';
import { fetchRSSFeeds } from './rss';
import { scoreRelevance } from '../utils/keywords';

export interface AggregatedNews {
  items: NewsItem[];
  sources: {
    name: string;
    count: number;
    status: 'ok' | 'error';
  }[];
  fetchedAt: string;
}

export async function aggregateNews(limit: number = 20): Promise<AggregatedNews> {
  const sources: AggregatedNews['sources'] = [];
  const allItems: NewsItem[] = [];

  // Fetch from all sources in parallel
  const [hnItems, redditItems, rssItems] = await Promise.all([
    fetchHackerNews(10).catch(() => []),
    fetchReddit(10).catch(() => []),
    fetchRSSFeeds(10).catch(() => []),
  ]);

  // Track source stats
  sources.push({
    name: 'Hacker News',
    count: hnItems.length,
    status: hnItems.length > 0 ? 'ok' : 'error',
  });
  
  sources.push({
    name: 'Reddit',
    count: redditItems.length,
    status: redditItems.length > 0 ? 'ok' : 'error',
  });
  
  sources.push({
    name: 'RSS Feeds',
    count: rssItems.length,
    status: rssItems.length > 0 ? 'ok' : 'error',
  });

  allItems.push(...hnItems, ...redditItems, ...rssItems);

  // Dedupe by URL (keep first occurrence)
  const seen = new Set<string>();
  const uniqueItems = allItems.filter((item) => {
    const normalized = item.url.toLowerCase().replace(/\/$/, '');
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });

  // Sort: relevance first, then hot items, then by date
  const sorted = uniqueItems.sort((a, b) => {
    // Relevance score (Claude, Agents, Productivity get priority)
    const relevanceA = scoreRelevance(a.title);
    const relevanceB = scoreRelevance(b.title);
    if (relevanceA !== relevanceB) return relevanceB - relevanceA;
    
    // Hot items next
    if (a.isHot && !b.isHot) return -1;
    if (!a.isHot && b.isHot) return 1;
    
    // Then by date
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateB - dateA;
    
    // Then by score if available
    return (b.score || 0) - (a.score || 0);
  });

  return {
    items: sorted.slice(0, limit),
    sources,
    fetchedAt: new Date().toISOString(),
  };
}
