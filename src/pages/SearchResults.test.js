import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchResults from './SearchResults';

const mockUseSearchParams = jest.fn();

jest.mock(
  'react-router-dom',
  () => ({
    useSearchParams: () => mockUseSearchParams(),
    Link: ({ to, className, children }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  }),
  { virtual: true }
);

describe('SearchResults', () => {
  it('encodes query parameter before fetching API', async () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams('q=Chicken%20%26%20Rice')]);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ meals: [] }),
    });

    render(<SearchResults />);

    await screen.findByText(/aucune recette trouvée/i);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.themealdb.com/api/json/v1/1/search.php?s=Chicken%20%26%20Rice'
    );
  });
});
