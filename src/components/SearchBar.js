import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar() {
  // État: stocker ce que l'utilisateur tape dans l'input 
  const [term, setTerm] = useState('');
  // État: stocker les suggestions triées (startsWith ou contains)
  const [suggestions, setSuggestions] = useState({ startsWith: [], contains: [] });
  // État: afficher ou masquer les suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  // État: navigation clavier (-1 = rien de sélectionné)
  const [selectedIndex, setSelectedIndex] = useState(-1);
  // État pour le loader
  const [isLoading, setIsLoading] = useState(false);

  const skipNextSearch = useRef(false);
  const navigate = useNavigate();

  // --- ALGORITHME DE TRI POUR LES SUGGESTIONS ---
  const filterSuggestions = (meals, query) => {
    if (!meals) return { startsWith: [], contains: [] }; // Si pas de recette, on retourne des listes vides
    const lowerQuery = query.toLowerCase(); // Comparaison insensible à la casse

    // Suggestions "commence par" 
    const startsWith = meals.filter(meal =>
      meal.strMeal.toLowerCase().startsWith(lowerQuery)
    ).slice(0, 5); // On en garde 5 au max

    // Suggestions "contient" (mais "ne commence pas par")
    const contains = meals.filter(meal => {
      const name = meal.strMeal.toLowerCase();
      return name.includes(lowerQuery) && !name.startsWith(lowerQuery);
    }).slice(0, 5); // On en garde 5 au max

    return { startsWith, contains };
  };

  // --- GESTION DE LA FRAPPE ET DEBOUNCE ---
  useEffect(() => {
    setSelectedIndex(-1); // Reset index à chaque nouvelle frappe
    // Si on vient de cliquer sur une suggestion, on ne relance pas l'API
    if (skipNextSearch.current) {
      skipNextSearch.current = false; // On reset le drapeau
      return;
    }
    
    if (term.length < 2) {
      setSuggestions({ startsWith: [], contains: [] });
      setShowSuggestions(false);
      setIsLoading(false);
      return;
    }

    // On active le loader dès que l'utilisateur tape (si > 2 char)
    setIsLoading(true);
    // Le DEBOUNCE : On déclenche un timer de 300ms
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`
        );
        const data = await response.json();
        // On trie les résultats reçus
        setSuggestions(filterSuggestions(data.meals, term));
        setShowSuggestions(true);
      } catch (error) {
        console.error("Erreur autocomplétion:", error);
      } finally {
        setIsLoading(false); // On arrête le loader après la réponse
      }
    }, 300); // Délai de 300ms

    // Nettoyage : Si l'utilisateur tape à nouveau avant les 300ms, on annule le timer précédent
    return () => {
      clearTimeout(timer);
      // Si on nettoie (nouvelle frappe), on garde loading true
    };
  }, [term]);

  // --- GESTION CLAVIER ---

  const handleSuggestionClick = (mealName) => {
    skipNextSearch.current = mealName !== term; // IMPORTANT : On bloque la prochaine recherche auto uniquement si le terme change
    setTerm(mealName);             // On met à jour l'input pour faire joli
    setShowSuggestions(false);     // On ferme force le menu
    navigate(`/search?q=${encodeURIComponent(mealName)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();  // Empêche le rechargement complet de la page
    if (term.trim()) {  // Si le champ n'est pas vide (espaces inutiles retirés)
      setShowSuggestions(false);  // On ferme les suggestions
      navigate(`/search?q=${encodeURIComponent(term.trim())}`); // On redirige vers la page de résultats avec le terme en paramètre d'URL "q"
    }
  };

  const handleKeyDown = (e) => {
    // On calcule combien de suggestions on a au total
    const total = suggestions.startsWith.length + suggestions.contains.length;
    if (total === 0) return;

    // FLÈCHE BAS
    if (e.key === 'ArrowDown') {
      e.preventDefault(); // Empêche le curseur de bouger dans l'input
      setSelectedIndex(prev => Math.min(prev + 1, total - 1));
    }
    // FLÈCHE HAUT
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1)); // -1 revient dans l'input
    }
    // ENTRÉE (seulement si une suggestion est sélectionnée)
    else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      // On combine les listes pour trouver l'élément à l'index X
      const all = [...suggestions.startsWith, ...suggestions.contains];
      if (all[selectedIndex]) handleSuggestionClick(all[selectedIndex].strMeal);
    }
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    
    <div className="search-bar-wrapper">  {/* Conteneur pour position relative */}
      <form onSubmit={handleSubmit} className="search-bar-container">
        {/* Balise <form> permet de valider avec la touche "Entrée" automatiquement */}

        <div className="icon-left">  {/* Icône Loupe (SVG) */}
          <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9aa0a6" width="20px" height="20px">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
        </div>

        {/* Input */}

        <input
          type="text"
          className="search-input"
          placeholder="Rechercher une recette..."
          value={term}
          // À chaque appui sur une touche, on met à jour l'état "term"
          onChange={(e) => setTerm(e.target.value)}
          // Ajout de l'écouteur pour le clavier
          onKeyDown={handleKeyDown}
          // Gestion du focus
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => term.length >= 2 && setShowSuggestions(true)}
        />
        {/* Zone Spinner ( affiché pendant loading) */}
        <div className="icon-right">
          {isLoading && <div className="spinner"></div>}
        </div>

        {/* Bouton Rechercher */}
        <button type="submit" className="search-button">
          Rechercher
        </button>
      </form>

      {/* --- AFFICHAGE DES SUGGESTIONS --- */}
      {showSuggestions && (suggestions.startsWith.length > 0 || suggestions.contains.length > 0) && (
        <div className="suggestions-dropdown">
          {/* Les suggestions "commence par" */}
          {suggestions.startsWith.length > 0 && (
            <div className="suggestion-group">
              <div className="group-title">COMMENCENT PAR "{term.toUpperCase()}"</div>
              <ul className="suggestion-list">
                {suggestions.startsWith.map((meal, index) => (
                  <li
                    key={meal.idMeal}
                    // Si l'index correspond, on ajoute la classe 'selected'
                    className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                    // onMouseDown est utilisé au lieu de onClick car il se déclenche avant le onBlur de l'input
                    onMouseDown={() => handleSuggestionClick(meal.strMeal)}
                  >
                    <img src={meal.strMealThumb} alt="" className="thumb-mini" />
                    <span>{meal.strMeal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Les suggestions "contient" (mais "ne commence pas par") */}
          {suggestions.contains.length > 0 && (
            <div className="suggestion-group">
              {suggestions.startsWith.length > 0 && <div className="separator"></div>}
              <div className="group-title">CONTIENNENT "{term.toUpperCase()}"</div>
              <ul className="suggestion-list">
                {suggestions.contains.map((meal, index) => {
                  // L'index global de ce groupe commence APRES ceux du premier groupe
                  const globalIndex = index + suggestions.startsWith.length;
                  return (
                    <li
                      key={meal.idMeal}
                      className={`suggestion-item ${globalIndex === selectedIndex ? 'selected' : ''}`}
                      onMouseDown={() => handleSuggestionClick(meal.strMeal)}
                    >
                      <img src={meal.strMealThumb} alt="" className="thumb-mini" />
                      <span>{meal.strMeal}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
