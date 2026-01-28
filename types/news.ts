export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  date: string;
  isHot?: boolean;
  score?: number;
  bookmarkedAt?: string;
}

export interface TrendingTopic {
  term: string;
  count: number;
  weight: number;
  isHighPriority?: boolean;
}

export interface NewsResponse {
  items: NewsItem[];
  sources: {
    name: string;
    count: number;
    status: 'ok' | 'error';
  }[];
  trending: TrendingTopic[];
  fetchedAt: string;
}
