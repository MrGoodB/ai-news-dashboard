import type { NewsItem } from '@/types/news';

const SUBREDDITS = [
  'MachineLearning',
  'artificial',
  'LocalLLaMA',
  'ChatGPT',
  'singularity',
];

interface RedditPost {
  data: {
    id: string;
    title: string;
    url: string;
    permalink: string;
    created_utc: number;
    score: number;
    subreddit: string;
    is_self: boolean;
    selftext: string;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

export async function fetchReddit(limit: number = 10): Promise<NewsItem[]> {
  try {
    const allPosts: NewsItem[] = [];

    // Fetch from each subreddit
    const subredditPromises = SUBREDDITS.map(async (subreddit) => {
      try {
        const res = await fetch(
          `https://www.reddit.com/r/${subreddit}/hot.json?limit=15`,
          {
            headers: {
              'User-Agent': 'AI-News-Dashboard/1.0',
            },
          }
        );
        
        if (!res.ok) return [];
        
        const data: RedditResponse = await res.json();
        
        return data.data.children
          .filter((post) => !post.data.is_self || post.data.selftext.length > 100)
          .map((post) => ({
            id: `reddit-${post.data.id}`,
            title: post.data.title,
            url: post.data.is_self 
              ? `https://reddit.com${post.data.permalink}`
              : post.data.url,
            source: `r/${post.data.subreddit}`,
            date: new Date(post.data.created_utc * 1000).toISOString().split('T')[0],
            isHot: post.data.score > 500,
            score: post.data.score,
          }));
      } catch {
        return [];
      }
    });

    const results = await Promise.all(subredditPromises);
    results.forEach((posts) => allPosts.push(...posts));

    // Sort by score and dedupe
    return allPosts
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching Reddit:', error);
    return [];
  }
}
