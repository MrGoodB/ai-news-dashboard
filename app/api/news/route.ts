import { NextResponse } from 'next/server';
import { aggregateNews } from '@/lib/sources';
import { extractTrendingTopics } from '@/lib/utils/keywords';
import type { NewsResponse } from '@/types/news';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(): Promise<NextResponse<NewsResponse>> {
  try {
    const news = await aggregateNews(20);
    
    // Extract trending topics from titles
    const titles = news.items.map(item => item.title);
    const trending = extractTrendingTopics(titles);
    
    return NextResponse.json({
      ...news,
      trending,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error aggregating news:', error);
    
    return NextResponse.json(
      {
        items: [],
        sources: [],
        trending: [],
        fetchedAt: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
