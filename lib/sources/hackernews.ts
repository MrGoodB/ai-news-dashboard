import type { NewsItem } from '@/types/news';
import { isAIRelated, scoreRelevance } from '../utils/keywords';

const HN_API = 'https://hacker-news.firebaseio.com/v0';

interface HNStory {
  id: number;
  title: string;
  url?: string;
  time: number;
  score: number;
  by: string;
}

export async function fetchHackerNews(limit: number = 10): Promise<NewsItem[]> {
  try {
    // Get top stories
    const topStoriesRes = await fetch(`${HN_API}/topstories.json`);
    const topStoryIds: number[] = await topStoriesRes.json();

    // Fetch story details (first 100 to find AI-related ones)
    const storyPromises = topStoryIds.slice(0, 100).map(async (id) => {
      const res = await fetch(`${HN_API}/item/${id}.json`);
      return res.json() as Promise<HNStory>;
    });

    const stories = await Promise.all(storyPromises);

    // Filter AI-related stories
    const aiStories = stories
      .filter((story): story is HNStory => 
        story !== null && 
        typeof story.title === 'string' && 
        typeof story.url === 'string' && 
        isAIRelated(story.title)
      )
      .slice(0, limit);

    return aiStories.map((story) => ({
      id: `hn-${story.id}`,
      title: story.title,
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      source: 'Hacker News',
      date: new Date(story.time * 1000).toISOString().split('T')[0],
      isHot: story.score > 200 || scoreRelevance(story.title) > 15,
      score: story.score,
    }));
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return [];
  }
}
