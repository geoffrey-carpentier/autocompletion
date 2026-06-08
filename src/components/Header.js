import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar'; // On importe la barre
import './Header.css';

/**
 * Render the site header containing a logo link and search bar, omitted on the home page.
 *
 * @returns {JSX.Element|null} The header element with the logo and SearchBar, or `null` when the current route is `'/'`.
 */
export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Si on est sur l'accueil, on ne montre pas ce header (car il y a déjà la grosse barre au centre)
  if (isHomePage) return null;

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Logo à gauche */}
        <Link to="/" className="logo-link">
          <span className="blue">Good</span><span className="orange">Food</span>
        </Link>
        
        {/* Barre de recherche au centre/droite */}
        <div className="header-search">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
