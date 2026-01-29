/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchFilter } from '@/components/SearchFilter';
import { createRef } from 'react';

describe('SearchFilter', () => {
  const mockOnSearch = jest.fn();
  const mockOnFilterSource = jest.fn();
  const mockSources = ['Hacker News', 'Reddit', 'AI Blog'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(
      <SearchFilter
        onSearch={mockOnSearch}
        onFilterSource={mockOnFilterSource}
        sources={mockSources}
        selectedSource={null}
        searchInputRef={createRef()}
      />
    );

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('renders source dropdown with all sources', () => {
    render(
      <SearchFilter
        onSearch={mockOnSearch}
        onFilterSource={mockOnFilterSource}
        sources={mockSources}
        selectedSource={null}
        searchInputRef={createRef()}
      />
    );

    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();

    // Check all sources are in the dropdown
    mockSources.forEach(source => {
      expect(screen.getByText(source)).toBeInTheDocument();
    });
  });

  it('calls onSearch when typing in search input', () => {
    render(
      <SearchFilter
        onSearch={mockOnSearch}
        onFilterSource={mockOnFilterSource}
        sources={mockSources}
        selectedSource={null}
        searchInputRef={createRef()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'claude' } });

    expect(mockOnSearch).toHaveBeenCalledWith('claude');
  });

  it('calls onFilterSource when selecting a source', () => {
    render(
      <SearchFilter
        onSearch={mockOnSearch}
        onFilterSource={mockOnFilterSource}
        sources={mockSources}
        selectedSource={null}
        searchInputRef={createRef()}
      />
    );

    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'Reddit' } });

    expect(mockOnFilterSource).toHaveBeenCalledWith('Reddit');
  });

  it('shows "All Sources" as default option', () => {
    render(
      <SearchFilter
        onSearch={mockOnSearch}
        onFilterSource={mockOnFilterSource}
        sources={mockSources}
        selectedSource={null}
        searchInputRef={createRef()}
      />
    );

    expect(screen.getByText('All Sources')).toBeInTheDocument();
  });
});
