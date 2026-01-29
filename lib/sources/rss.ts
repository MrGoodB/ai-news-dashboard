import type { NewsItem } from '@/types/news';

interface RSSFeed {
  name: string;
  url: string;
}

const AI_FEEDS: RSSFeed[] = [
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml' },
  { name: 'Anthropic', url: 'https://www.anthropic.com/rss.xml' },
  { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/' },
  { name: 'DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
  { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml' },
  { name: 'MIT AI News', url: 'https://news.mit.edu/rss/topic/artificial-intelligence2' },
];

// Simple XML parser for RSS (no external deps)
function parseRSSItem(xml: string, feedName: string): NewsItem | null {
  try {
    const titleMatch = xml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title>([\s\S]*?)<\/title>/);
    const linkMatch = xml.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>|<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = xml.match(/<pubDate>(.*?)<\/pubDate>/);
    
    const title = titleMatch?.[1] || titleMatch?.[2];
    const link = linkMatch?.[1] || linkMatch?.[2];
    
    if (!title || !link) return null;
    
    let date = new Date().toISOString().split('T')[0];
    if (pubDateMatch?.[1]) {
      const parsed = new Date(pubDateMatch[1]);
      if (!isNaN(parsed.getTime())) {
        date = parsed.toISOString().split('T')[0];
      }
    }

    return {
      id: `rss-${feedName.toLowerCase().replace(/\s+/g, '-')}-${btoa(link).slice(0, 10)}`,
      title: title.trim(),
      url: link.trim(),
      source: feedName,
      date,
      isHot: true, // Official blog posts are always notable
    };
  } catch {
    return null;
  }
}

async function fetchFeed(feed: RSSFeed): Promise<NewsItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: {
        'User-Agent': 'AI-News-Dashboard/1.0',
      },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    
    // Extract items from RSS/Atom
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>|<entry>([\s\S]*?)<\/entry>/g);
    
    if (!itemMatches) return [];

    return itemMatches
      .slice(0, 5) // Max 5 per feed
      .map((item) => parseRSSItem(item, feed.name))
      .filter((item): item is NewsItem => item !== null);
  } catch (error) {
    console.error(`Error fetching ${feed.name}:`, error);
    return [];
  }
}

export async function fetchRSSFeeds(limit: number = 10): Promise<NewsItem[]> {
  try {
    const feedPromises = AI_FEEDS.map((feed) => fetchFeed(feed));
    const results = await Promise.all(feedPromises);
    
    const allItems: NewsItem[] = [];
    results.forEach((items) => allItems.push(...items));

    // Sort by date (newest first) and limit
    return allItems
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return [];
  }
}
