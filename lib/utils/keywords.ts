// AI-related keywords to extract from titles
const AI_TERMS = new Set([
  'ai', 'gpt', 'llm', 'chatgpt', 'claude', 'gemini', 'llama', 'mistral',
  'openai', 'anthropic', 'google', 'meta', 'microsoft', 'nvidia', 'deepmind',
  'transformer', 'diffusion', 'neural', 'machine learning', 'deep learning',
  'nlp', 'vision', 'multimodal', 'rag', 'embedding', 'vector', 'agent',
  'reasoning', 'benchmark', 'open source', 'fine-tune', 'training',
  'inference', 'gpu', 'model', 'api', 'safety', 'alignment', 'agi',
  'automation', 'copilot', 'assistant', 'robot', 'autonomous',
]);

// Common words to ignore
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
  'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we',
  'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all',
  'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'also', 'now', 'new', 'first', 'last', 'long', 'great', 'little',
  'own', 'other', 'old', 'right', 'big', 'high', 'different', 'small',
  'large', 'next', 'early', 'young', 'important', 'public', 'bad', 'same',
  'able', 'into', 'after', 'before', 'between', 'under', 'over', 'again',
  'further', 'then', 'once', 'here', 'there', 'why', 'how', 'any', 'about',
  'up', 'out', 'if', 'because', 'as', 'until', 'while', 'during', 'through',
  'your', 'its', 'his', 'her', 'their', 'our', 'my', 'get', 'got', 'gets',
  'using', 'use', 'used', 'like', 'make', 'makes', 'made', 'via', 'says',
  'said', 'show', 'shows', 'announced', 'releases', 'released', 'launches',
]);

export interface TrendingTopic {
  term: string;
  count: number;
  weight: number; // 0-1 normalized
}

export function extractTrendingTopics(titles: string[]): TrendingTopic[] {
  const termCounts = new Map<string, number>();

  titles.forEach(title => {
    const words = title.toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);

    // Count individual words
    words.forEach(word => {
      if (STOP_WORDS.has(word)) return;
      
      // Boost AI-related terms
      const count = termCounts.get(word) || 0;
      const boost = AI_TERMS.has(word) ? 2 : 1;
      termCounts.set(word, count + boost);
    });

    // Check for compound terms
    const lowerTitle = title.toLowerCase();
    AI_TERMS.forEach(term => {
      if (term.includes(' ') && lowerTitle.includes(term)) {
        const count = termCounts.get(term) || 0;
        termCounts.set(term, count + 3); // Higher boost for compound matches
      }
    });
  });

  // Sort by count and take top terms
  const sorted = Array.from(termCounts.entries())
    .filter(([, count]) => count >= 2) // Minimum 2 occurrences
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  if (sorted.length === 0) return [];

  // Normalize weights
  const maxCount = sorted[0][1];
  
  return sorted.map(([term, count]) => ({
    term: term.charAt(0).toUpperCase() + term.slice(1), // Capitalize
    count,
    weight: Math.max(0.3, count / maxCount), // Min weight 0.3
  }));
}
