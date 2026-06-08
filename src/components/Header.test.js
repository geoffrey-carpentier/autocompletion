import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

const mockUseLocation = jest.fn();

jest.mock('./SearchBar', () => () => <div data-testid="searchbar-mock" />);

jest.mock(
  'react-router-dom',
  () => ({
    useLocation: () => mockUseLocation(),
    Link: ({ to, className, children }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  }),
  { virtual: true }
);

describe('Header', () => {
  it('is hidden on the home page', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' });
    render(<Header />);

    expect(screen.queryByRole('link', { name: /good food/i })).not.toBeInTheDocument();
  });

  it('is visible on non-home routes', () => {
    mockUseLocation.mockReturnValue({ pathname: '/search' });
    render(<Header />);

    expect(screen.getByRole('link', { name: /good food/i })).toBeInTheDocument();
  });
});
