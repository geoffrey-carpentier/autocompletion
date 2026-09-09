import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SearchBar from './SearchBar';

const mockNavigate = jest.fn();

jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => mockNavigate,
  }),
  { virtual: true }
);

function mockFetchSuggestions(names) {
  return {
    json: async () => ({
      meals: names.map((name, index) => ({
        idMeal: `${index + 1}`,
        strMeal: name,
        strMealThumb: 'https://www.themealdb.com/images/media/meals/test.jpg',
      })),
    }),
  };
}

describe('SearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockNavigate.mockReset();
    global.fetch = jest.fn().mockResolvedValue(
      mockFetchSuggestions(['Chicken & Mushroom Hotpot', 'Arrabiata'])
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('encodes the meal name when navigating from a suggestion click', async () => {
    render(<SearchBar />);

    fireEvent.change(screen.getByPlaceholderText('Rechercher une recette...'), {
      target: { value: 'Chicken & Mushroom Hotpot' },
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    const suggestion = await screen.findByText('Chicken & Mushroom Hotpot');
    fireEvent.mouseDown(suggestion);

    expect(mockNavigate).toHaveBeenCalledWith('/search?q=Chicken%20%26%20Mushroom%20Hotpot');
  });

  it('does not swallow the next search when clicking a suggestion with the same term', async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Rechercher une recette...');

    fireEvent.change(input, { target: { value: 'Arrabiata' } });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    const suggestion = await screen.findByText('Arrabiata');
    fireEvent.mouseDown(suggestion);

    fireEvent.change(input, { target: { value: 'Arrabiataa' } });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
