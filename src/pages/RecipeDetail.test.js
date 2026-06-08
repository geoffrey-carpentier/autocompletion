import React from 'react';
import { render, screen } from '@testing-library/react';
import RecipeDetail from './RecipeDetail';

const mockUseParams = jest.fn();

jest.mock(
  'react-router-dom',
  () => ({
    useParams: () => mockUseParams(),
    useNavigate: () => jest.fn(),
  }),
  { virtual: true }
);

describe('RecipeDetail', () => {
  it('fetches and displays recipe details from route id', async () => {
    mockUseParams.mockReturnValue({ id: '52772' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        meals: [
          {
            idMeal: '52772',
            strMeal: 'Teriyaki Chicken Casserole',
            strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
            strCategory: 'Chicken',
            strArea: 'Japanese',
            strInstructions: 'Step 1\nStep 2',
            strIngredient1: 'Chicken',
            strMeasure1: '500g',
            strIngredient2: '',
            strMeasure2: '',
          },
        ],
      }),
    });

    render(<RecipeDetail />);

    expect(screen.getByText(/chargement des détails/i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Teriyaki Chicken Casserole' })).toBeInTheDocument();
    expect(screen.getByText('500g')).toBeInTheDocument();
    expect(screen.getByText('Chicken', { selector: '.ingredients-list .name' })).toBeInTheDocument();
    expect(screen.getByText(/Step 1/)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772'
    );
  });
});
