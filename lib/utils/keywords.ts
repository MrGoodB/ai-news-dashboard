// AI-related keywords to extract from titles
// Prioritized for Claude, Agents, Productivity focus
const AI_TERMS = new Set([
  // Claude & Anthropic (highest priority)
  'claude', 'anthropic', 'claude code', 'sonnet', 'opus', 'haiku',
  
  // Agents & Automation
  'agent', 'agents', 'agentic', 'autonomous', 'automation', 'workflow',
  'mcp', 'tool use', 'function calling', 'orchestration',
  
  // Productivity & Coding
  'copilot', 'cursor', 'windsurf', 'codeium', 'tabnine', 'replit',
  'productivity', 'coding assistant', 'code generation', 'ide',
  
  // Core AI/LLM terms
  'ai', 'llm', 'gpt', 'chatgpt', 'openai', 'gemini', 'llama', 'mistral',
  'transformer', 'neural', 'machine learning', 'deep learning',
  
  // Other major players
  'google', 'meta', 'microsoft', 'nvidia', 'deepmind', 'hugging face',
  
  // Technical terms
  'nlp', 'multimodal', 'rag', 'embedding', 'vector', 'fine-tune',
  'context window', 'reasoning', 'benchmark', 'inference', 'training',
  
  // Emerging
  'agi', 'alignment', 'safety', 'open source', 'local llm',
]);

// Terms that indicate HIGH relevance for Alex
const HIGH_PRIORITY_TERMS = new Set([
  'claude', 'anthropic', 'agent', 'agentic', 'productivity',
  'claude code', 'mcp', 'automation', 'workflow', 'coding assistant',
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
  isHighPriority: boolean;
}

export function extractTrendingTopics(titles: string[]): TrendingTopic[] {
  const termCounts = new Map<string, number>();
  const highPriorityMatches = new Set<string>();

  titles.forEach(title => {
    const lowerTitle = title.toLowerCase();
    const words = lowerTitle
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);

    // Check for high priority compound terms first
    HIGH_PRIORITY_TERMS.forEach(term => {
      if (lowerTitle.includes(term)) {
        const count = termCounts.get(term) || 0;
        termCounts.set(term, count + 5); // High boost
        highPriorityMatches.add(term);
      }
    });

    // Check for compound AI terms
    AI_TERMS.forEach(term => {
      if (term.includes(' ') && lowerTitle.includes(term) && !highPriorityMatches.has(term)) {
        const count = termCounts.get(term) || 0;
        termCounts.set(term, count + 3);
      }
    });

    // Count individual words
    words.forEach(word => {
      if (STOP_WORDS.has(word)) return;
      if (highPriorityMatches.has(word)) return; // Already counted
      
      const count = termCounts.get(word) || 0;
      const boost = HIGH_PRIORITY_TERMS.has(word) ? 4 : AI_TERMS.has(word) ? 2 : 1;
      termCounts.set(word, count + boost);
    });
  });

  // Sort by count and take top terms
  const sorted = Array.from(termCounts.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  if (sorted.length === 0) return [];

  const maxCount = sorted[0][1];
  
  return sorted.map(([term, count]) => ({
    term: term.charAt(0).toUpperCase() + term.slice(1),
    count,
    weight: Math.max(0.3, count / maxCount),
    isHighPriority: HIGH_PRIORITY_TERMS.has(term.toLowerCase()),
  }));
}

// Check if a title is relevant for AI news
export function isAIRelated(title: string): boolean {
  const lower = title.toLowerCase();
  return Array.from(AI_TERMS).some(keyword => lower.includes(keyword));
}

// Score relevance (higher = more relevant to Alex's interests)
export function scoreRelevance(title: string): number {
  const lower = title.toLowerCase();
  let score = 0;
  
  HIGH_PRIORITY_TERMS.forEach(term => {
    if (lower.includes(term)) score += 10;
  });
  
  AI_TERMS.forEach(term => {
    if (lower.includes(term)) score += 2;
  });
  
  return score;
}
