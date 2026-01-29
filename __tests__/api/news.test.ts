/**
 * API Integration Tests
 * These tests require the server to be running and use fetch()
 * Run with: npm run test:integration (or manually start the server first)
 */

const API_URL = process.env.TEST_API_URL || 'http://localhost:3001';

describe('GET /api/news', () => {
  // Skip if no server is running
  const testOrSkip = process.env.RUN_INTEGRATION_TESTS ? it : it.skip;

  const fetchNews = async () => {
    const response = await fetch(`${API_URL}/api/news`);
    return response;
  };

  testOrSkip('returns a news response with required fields', async () => {
    const response = await fetchNews();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('sources');
    expect(data).toHaveProperty('trending');
    expect(data).toHaveProperty('fetchedAt');
  });

  testOrSkip('returns arrays for items, sources, and trending', async () => {
    const response = await fetchNews();
    const data = await response.json();

    expect(Array.isArray(data.items)).toBe(true);
    expect(Array.isArray(data.sources)).toBe(true);
    expect(Array.isArray(data.trending)).toBe(true);
  });

  testOrSkip('returns source status information', async () => {
    const response = await fetchNews();
    const data = await response.json();

    data.sources.forEach((source: { name: string; count: number; status: string }) => {
      expect(source).toHaveProperty('name');
      expect(source).toHaveProperty('count');
      expect(source).toHaveProperty('status');
      expect(['ok', 'error']).toContain(source.status);
    });
  });

  testOrSkip('returns valid fetchedAt timestamp', async () => {
    const response = await fetchNews();
    const data = await response.json();

    const date = new Date(data.fetchedAt);
    expect(date.toString()).not.toBe('Invalid Date');
  });

  testOrSkip('news items have correct structure when present', async () => {
    const response = await fetchNews();
    const data = await response.json();

    if (data.items.length > 0) {
      const item = data.items[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('url');
      expect(item).toHaveProperty('source');
      expect(item).toHaveProperty('date');
    }
  });

  testOrSkip('news items have valid URLs when present', async () => {
    const response = await fetchNews();
    const data = await response.json();

    data.items.forEach((item: { url: string }) => {
      expect(item.url).toMatch(/^https?:\/\//);
    });
  });

  testOrSkip('trending topics have correct structure', async () => {
    const response = await fetchNews();
    const data = await response.json();

    data.trending.forEach((topic: { term: string; count: number; weight: number }) => {
      expect(topic).toHaveProperty('term');
      expect(topic).toHaveProperty('count');
      expect(topic).toHaveProperty('weight');
      expect(typeof topic.term).toBe('string');
      expect(typeof topic.count).toBe('number');
      expect(typeof topic.weight).toBe('number');
    });
  });

  testOrSkip('returns proper cache headers', async () => {
    const response = await fetchNews();
    
    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toContain('s-maxage');
  });
});
