/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NewsCard } from '@/components/NewsCard';
import type { NewsItem } from '@/types/news';

const mockNewsItem: NewsItem = {
  id: 'test-1',
  title: 'Claude 4 Released with Amazing New Features',
  url: 'https://example.com/claude-4',
  source: 'Hacker News',
  date: new Date().toISOString(),
  score: 150,
  comments: 42,
  isHot: true,
};

describe('NewsCard', () => {
  const mockToggleBookmark = jest.fn();
  const mockOnRead = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the news title', () => {
    render(
      <NewsCard
        item={mockNewsItem}
        isBookmarked={false}
        isRead={false}
        onToggleBookmark={mockToggleBookmark}
        onRead={mockOnRead}
      />
    );

    expect(screen.getByText('Claude 4 Released with Amazing New Features')).toBeInTheDocument();
  });

  it('renders the source badge', () => {
    render(
      <NewsCard
        item={mockNewsItem}
        isBookmarked={false}
        isRead={false}
        onToggleBookmark={mockToggleBookmark}
        onRead={mockOnRead}
      />
    );

    expect(screen.getByText('Hacker News')).toBeInTheDocument();
  });

  it('shows hot indicator for hot items', () => {
    render(
      <NewsCard
        item={mockNewsItem}
        isBookmarked={false}
        isRead={false}
        onToggleBookmark={mockToggleBookmark}
        onRead={mockOnRead}
      />
    );

    // Hot is displayed as "🔥 Hot" in a badge
    expect(screen.getByText(/🔥 Hot/)).toBeInTheDocument();
  });

  it('does not show hot indicator for non-hot items', () => {
    const normalItem = { ...mockNewsItem, isHot: false };
    render(
      <NewsCard
        item={normalItem}
        isBookmarked={false}
        isRead={false}
        onToggleBookmark={mockToggleBookmark}
        onRead={mockOnRead}
      />
    );

    expect(screen.queryByText(/🔥 Hot/)).not.toBeInTheDocument();
  });

  it('calls onToggleBookmark when bookmark button is clicked', () => {
    render(
      <NewsCard
        item={mockNewsItem}
        isBookmarked={false}
        isRead={false}
        onToggleBookmark={mockToggleBookmark}
        onRead={mockOnRead}
      />
    );

    const bookmarkButton = screen.getByTitle(/save/i);
    fireEvent.click(bookmarkButton);

    expect(mockToggleBookmark).toHaveBeenCalledTimes(1);
  });

  it('renders link with correct URL', () => {
    render(
      <NewsCard
        item={mockNewsItem}
        isBookmarked={false}
        isRead={false}
        onToggleBookmark={mockToggleBookmark}
        onRead={mockOnRead}
      />
    );

    const link = screen.getByRole('link', { name: /claude 4/i });
    expect(link).toHaveAttribute('href', 'https://example.com/claude-4');
  });

  it('applies read styling when isRead is true', () => {
    const { container } = render(
      <NewsCard
        item={mockNewsItem}
        isBookmarked={false}
        isRead={true}
        onToggleBookmark={mockToggleBookmark}
        onRead={mockOnRead}
      />
    );

    // Read items should have reduced opacity (opacity-75)
    expect(container.firstChild).toHaveClass('opacity-75');
  });

  it('shows score when above threshold', () => {
    render(
      <NewsCard
        item={mockNewsItem}
        isBookmarked={false}
        isRead={false}
        onToggleBookmark={mockToggleBookmark}
        onRead={mockOnRead}
      />
    );

    // Score is displayed as ↑150 when > 100
    expect(screen.getByText(/↑150/)).toBeInTheDocument();
  });
});
