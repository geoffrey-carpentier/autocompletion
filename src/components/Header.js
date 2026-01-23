import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Ne pas afficher le header sur la page d'accueil
  if (isHomePage) return null;

  return (
    <header className="app-header">
      <Link to="/" className="logo-link">
        <h1 className="header-title">
          <span className="blue">Good</span><span className="orange">Food</span>
        </h1>
      </Link>
    </header>
  );
}