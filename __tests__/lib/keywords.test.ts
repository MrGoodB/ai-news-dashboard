import { 
  extractTrendingTopics, 
  isAIRelated, 
  scoreRelevance 
} from '@/lib/utils/keywords';

describe('isAIRelated', () => {
  it('returns true for Claude-related titles', () => {
    expect(isAIRelated('New Claude 4 model announced by Anthropic')).toBe(true);
    expect(isAIRelated('Claude Code gets new features')).toBe(true);
    expect(isAIRelated('Anthropic releases Sonnet 3.5')).toBe(true);
  });

  it('returns true for agent-related titles', () => {
    expect(isAIRelated('Building AI agents with LangChain')).toBe(true);
    expect(isAIRelated('Agentic workflows are the future')).toBe(true);
    expect(isAIRelated('Autonomous coding agents')).toBe(true);
  });

  it('returns true for LLM-related titles', () => {
    expect(isAIRelated('OpenAI launches GPT-5')).toBe(true);
    expect(isAIRelated('New LLM benchmark results')).toBe(true);
    expect(isAIRelated('Llama 3 performance analysis')).toBe(true);
  });

  it('returns false for unrelated titles', () => {
    expect(isAIRelated('New JavaScript framework released')).toBe(false);
    expect(isAIRelated('Best restaurants in Paris')).toBe(false);
    expect(isAIRelated('Stock market update')).toBe(false);
  });
});

describe('scoreRelevance', () => {
  it('gives highest scores to Claude/Anthropic content', () => {
    const claudeScore = scoreRelevance('Claude 4 is amazing');
    const anthropicScore = scoreRelevance('Anthropic research paper');
    const genericAIScore = scoreRelevance('AI news today');
    
    expect(claudeScore).toBeGreaterThan(genericAIScore);
    expect(anthropicScore).toBeGreaterThan(genericAIScore);
  });

  it('gives high scores to agent-related content', () => {
    const agentScore = scoreRelevance('Building AI agents');
    const genericScore = scoreRelevance('Machine learning basics');
    
    expect(agentScore).toBeGreaterThan(genericScore);
  });

  it('gives high scores to productivity-related content', () => {
    const productivityScore = scoreRelevance('AI productivity tools');
    const codingAssistantScore = scoreRelevance('Coding assistant comparison');
    
    expect(productivityScore).toBeGreaterThan(0);
    expect(codingAssistantScore).toBeGreaterThan(0);
  });

  it('returns 0 for unrelated content', () => {
    expect(scoreRelevance('Weather forecast for tomorrow')).toBe(0);
    expect(scoreRelevance('Best pizza recipes')).toBe(0);
  });
});

describe('extractTrendingTopics', () => {
  it('extracts topics from titles', () => {
    const titles = [
      'Claude 4 announced',
      'Claude Code gets update',
      'New AI agent framework',
      'AI agents are the future',
    ];
    
    const topics = extractTrendingTopics(titles);
    
    expect(topics.length).toBeGreaterThan(0);
    expect(topics.some(t => t.term.toLowerCase() === 'claude')).toBe(true);
    expect(topics.some(t => t.term.toLowerCase() === 'agent' || t.term.toLowerCase() === 'agents')).toBe(true);
  });

  it('marks high-priority topics', () => {
    const titles = [
      'Claude is the best LLM',
      'Claude Code review',
      'Anthropic research',
    ];
    
    const topics = extractTrendingTopics(titles);
    const claudeTopic = topics.find(t => t.term.toLowerCase() === 'claude');
    
    expect(claudeTopic?.isHighPriority).toBe(true);
  });

  it('returns empty array for no input', () => {
    expect(extractTrendingTopics([])).toEqual([]);
  });

  it('filters out stop words', () => {
    const titles = [
      'The AI is very good',
      'This is a test',
    ];
    
    const topics = extractTrendingTopics(titles);
    const hasStopWord = topics.some(t => 
      ['the', 'is', 'very', 'this', 'a'].includes(t.term.toLowerCase())
    );
    
    expect(hasStopWord).toBe(false);
  });
});
