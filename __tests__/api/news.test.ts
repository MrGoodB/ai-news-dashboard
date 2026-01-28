import { GET } from '@/app/api/news/route';
import type { NewsResponse } from '@/types/news';

describe('GET /api/news', () => {
  it('returns a news response with required fields', async () => {
    const response = await GET();
    const data: NewsResponse = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('sources');
    expect(data).toHaveProperty('trending');
    expect(data).toHaveProperty('fetchedAt');
  });

  it('returns arrays for items, sources, and trending', async () => {
    const response = await GET();
    const data: NewsResponse = await response.json();

    expect(Array.isArray(data.items)).toBe(true);
    expect(Array.isArray(data.sources)).toBe(true);
    expect(Array.isArray(data.trending)).toBe(true);
  });

  it('returns source status information', async () => {
    const response = await GET();
    const data: NewsResponse = await response.json();

    data.sources.forEach((source) => {
      expect(source).toHaveProperty('name');
      expect(source).toHaveProperty('count');
      expect(source).toHaveProperty('status');
      expect(['ok', 'error']).toContain(source.status);
    });
  });

  it('returns valid fetchedAt timestamp', async () => {
    const response = await GET();
    const data: NewsResponse = await response.json();

    const date = new Date(data.fetchedAt);
    expect(date.toString()).not.toBe('Invalid Date');
  });

  it('news items have correct structure when present', async () => {
    const response = await GET();
    const data: NewsResponse = await response.json();

    if (data.items.length > 0) {
      const item = data.items[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('url');
      expect(item).toHaveProperty('source');
      expect(item).toHaveProperty('date');
    }
  });

  it('news items have valid URLs when present', async () => {
    const response = await GET();
    const data: NewsResponse = await response.json();

    data.items.forEach((item) => {
      expect(item.url).toMatch(/^https?:\/\//);
    });
  });

  it('trending topics have correct structure', async () => {
    const response = await GET();
    const data: NewsResponse = await response.json();

    data.trending.forEach((topic) => {
      expect(topic).toHaveProperty('term');
      expect(topic).toHaveProperty('count');
      expect(topic).toHaveProperty('weight');
      expect(typeof topic.term).toBe('string');
      expect(typeof topic.count).toBe('number');
      expect(typeof topic.weight).toBe('number');
    });
  });

  it('returns proper cache headers', async () => {
    const response = await GET();
    
    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('s-maxage');
  });
});
