import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

/**
 * Render a search bar with debounced MealDB-backed autocomplete suggestions, keyboard navigation, and navigation to the search results page when submitting or selecting a suggestion.
 *
 * The component manages the input term, two suggestion groups ("starts with" and "contains"), dropdown visibility, a selected index for keyboard navigation, and a loading indicator. It fetches suggestions after a short debounce when the term has at least two characters, allows selection via mouse or keyboard (ArrowUp/Down, Enter, Escape), and navigates to `/search?q=...` on selection or form submit.
 *
 * @returns {JSX.Element} A SearchBar React element containing the input, optional loading spinner, and a grouped suggestions dropdown.
export default function SearchBar() {
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState({ startsWith: [], contains: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false); // État pour le loader
  
  const navigate = useNavigate();

  // --- ALGORITHME DE TRI ---
  const filterSuggestions = (meals, query) => {
    if (!meals) return { startsWith: [], contains: [] };
    const lowerQuery = query.toLowerCase();

    const startsWith = meals.filter(meal =>
      meal.strMeal.toLowerCase().startsWith(lowerQuery)
    ).slice(0, 5);

    const contains = meals.filter(meal => {
      const name = meal.strMeal.toLowerCase();
      return name.includes(lowerQuery) && !name.startsWith(lowerQuery);
    }).slice(0, 5);

    return { startsWith, contains };
  };

  // --- DEBOUNCE & APPEL API ---
  useEffect(() => {
    setSelectedIndex(-1);

    if (term.length < 2) {
      setSuggestions({ startsWith: [], contains: [] });
      setShowSuggestions(false);
      setIsLoading(false);
      return;
    }

    // On active le loader dès que l'utilisateur tape (si > 2 char)
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await response.json();
        setSuggestions(filterSuggestions(data.meals, term));
        setShowSuggestions(true);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false); // On arrête le loader après la réponse
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      // Si on nettoie (nouvelle frappe), on garde loading true
    };
  }, [term]);

  // --- GESTION CLAVIER ---
  const handleKeyDown = (e) => {
    const totalSuggestions = suggestions.startsWith.length + suggestions.contains.length;
    if (totalSuggestions === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, totalSuggestions - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const allSuggestions = [...suggestions.startsWith, ...suggestions.contains];
      const selectedMeal = allSuggestions[selectedIndex];
      if (selectedMeal) handleSuggestionClick(selectedMeal.strMeal);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (mealName) => {
    setTerm(mealName);
    setShowSuggestions(false);
    navigate(`/search?q=${mealName}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${term}`);
    }
  };

  return (
    <div className="search-bar-wrapper">
      <form onSubmit={handleSubmit} className="search-bar-container">
        {/* Icône Loupe (SVG) */}
        <div className="icon-left">
          <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9aa0a6" width="20px" height="20px">
             <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Rechercher une recette..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => term.length >= 2 && setShowSuggestions(true)}
        />

        {/* Loader conditionnel ou vide */}
        <div className="icon-right">
            {isLoading && (
              <div className="spinner"></div>
            )}
        </div>

        {/* Note: Le bouton "Rechercher" peut être conservé ou retiré selon le style désiré.
            Pour un style Header compact, on l'enlève souvent, mais gardons-le pour la Home. */}
      </form>

      {/* --- LISTE SUGGESTIONS --- */}
      {showSuggestions && (suggestions.startsWith.length > 0 || suggestions.contains.length > 0) && (
        <div className="suggestions-dropdown">
          {suggestions.startsWith.length > 0 && (
            <div className="suggestion-group">
              <div className="group-title">COMMENCENT PAR "{term.toUpperCase()}"</div>
              <ul className="suggestion-list">
                {suggestions.startsWith.map((meal, index) => (
                  <li
                    key={meal.idMeal}
                    className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                    onMouseDown={() => handleSuggestionClick(meal.strMeal)}
                  >
                    <img src={meal.strMealThumb} alt="" className="thumb-mini" />
                    <span>{meal.strMeal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {suggestions.contains.length > 0 && (
            <div className="suggestion-group">
              {suggestions.startsWith.length > 0 && <div className="separator"></div>}
              <div className="group-title">CONTIENNENT "{term.toUpperCase()}"</div>
              <ul className="suggestion-list">
                {suggestions.contains.map((meal, index) => {
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