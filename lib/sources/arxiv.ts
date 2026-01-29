import type { NewsItem } from '@/types/news';
import { isAIRelated } from '../utils/keywords';

const ARXIV_API = 'http://export.arxiv.org/api/query';

// Categories relevant to AI/ML
const CATEGORIES = [
  'cs.AI',   // Artificial Intelligence
  'cs.LG',   // Machine Learning  
  'cs.CL',   // Computation and Language (NLP)
  'cs.CV',   // Computer Vision
  'stat.ML', // Machine Learning (Statistics)
];

interface ArxivEntry {
  title: string;
  link: string;
  published: string;
  summary: string;
  authors: string[];
}

function parseArxivResponse(xml: string): ArxivEntry[] {
  const entries: ArxivEntry[] = [];
  
  // Simple XML parsing for ArXiv response
  const entryMatches = xml.match(/<entry>([\s\S]*?)<\/entry>/g);
  if (!entryMatches) return entries;

  for (const entry of entryMatches.slice(0, 20)) {
    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = entry.match(/<id>([\s\S]*?)<\/id>/);
    const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);
    const summaryMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/);
    
    if (titleMatch && linkMatch && publishedMatch) {
      const title = titleMatch[1].replace(/\s+/g, ' ').trim();
      
      entries.push({
        title,
        link: linkMatch[1].trim(),
        published: publishedMatch[1].trim(),
        summary: summaryMatch?.[1]?.replace(/\s+/g, ' ').trim() || '',
        authors: [],
      });
    }
  }

  return entries;
}

export async function fetchArxiv(limit: number = 10): Promise<NewsItem[]> {
  try {
    // Search for recent papers in AI categories
    const categoryQuery = CATEGORIES.map(c => `cat:${c}`).join('+OR+');
    const url = `${ARXIV_API}?search_query=${categoryQuery}&sortBy=submittedDate&sortOrder=descending&max_results=50`;

    const response = await fetch(url);

    if (!response.ok) return [];

    const xml = await response.text();
    const entries = parseArxivResponse(xml);

    // Filter for AI-related papers and transform
    return entries
      .filter(entry => isAIRelated(entry.title) || isAIRelated(entry.summary))
      .slice(0, limit)
      .map((entry, index) => ({
        id: `arxiv-${entry.link.split('/').pop() || index}`,
        title: `📄 ${entry.title}`,
        url: entry.link.replace('http://', 'https://'),
        source: 'ArXiv',
        date: entry.published.split('T')[0],
        isHot: false, // Papers aren't "hot" in the same way
      }));
  } catch (error) {
    console.error('Error fetching ArXiv:', error);
    return [];
  }
}
