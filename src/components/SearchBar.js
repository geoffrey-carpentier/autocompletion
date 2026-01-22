import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar() {
  // 1. État pour stocker ce que l'utilisateur tape dans l'input
  const [term, setTerm] = useState('');

  // 2. Hook pour permettre la navigation (redirection) sans recharger la page
  const navigate = useNavigate();

  // Fonction appelée quand l'utilisateur soumet le formulaire (Entrée ou clic sur bouton)
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement complet de la page (comportement par défaut HTML)

    // Si le champ n'est pas vide (après avoir retiré les espaces inutiles)
    if (term.trim()) {
      // On redirige vers la page de résultats avec le terme en paramètre d'URL "q"
      // Syntaxe demandée : /search?q={query}
      navigate(`/search?q=${term}`);
    }
  };

  return (
    // La balise <form> permet de valider avec la touche "Entrée" automatiquement
    <form onSubmit={handleSubmit} className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder="Rechercher une recette..."
        value={term}
        // À chaque appui sur une touche, on met à jour l'état "term"
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit" className="search-button">
        Rechercher
      </button>
    </form>
  );
}