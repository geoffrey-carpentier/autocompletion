import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar() {
  // État: stocker ce que l'utilisateur tape dans l'input 
  const [term, setTerm] = useState('');
  // État: stocker les suggestions triées (startsWith ou contains)
  const [suggestions, setSuggestions] = useState({ startsWith: [], contains: [] });
  // État: afficher ou masquer les suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Hook: permettre la navigation (redirection) sans recharger la page
  const navigate = useNavigate();

  //  ALGORITHME DE TRI POUR LES SUGGESTIONS
  const filterSuggestions = (meals, query) => {
    if (!meals) return { startsWith: [], contains: [] }; // Si pas de recette, on retourne des listes vides

    const lowerQuery = query.toLowerCase(); // Comparaison insensible à la casse

    // Suggestions "commence par" 
    const startsWith = meals.filter(meal =>
      meal.strMeal.toLowerCase().startsWith(lowerQuery)
    ).slice(0, 6); // On en garde 6 au max

    // Suggestions "contient" (mais "ne commence pas par")
    const contains = meals.filter(meal => {
      const name = meal.strMeal.toLowerCase();
      return name.includes(lowerQuery) && !name.startsWith(lowerQuery);
    }).slice(0, 6); // On en garde 6 au max

    return { startsWith, contains };
  };

  //  GESTION DE LA FRAPPE ET DEBOUNCE
  useEffect(() => {
    // Si la recherche est trop courte, on vide et on cache
    if (term.length < 2) {
      setSuggestions({ startsWith: [], contains: [] });
      setShowSuggestions(false);
      return;
    }

    // Le DEBOUNCE : On déclenche un timer de 300ms
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await response.json();

        // On trie les résultats reçus
        const filtered = filterSuggestions(data.meals, term);
        setSuggestions(filtered);
        setShowSuggestions(true);

      } catch (error) {
        console.error("Erreur autocomplétion:", error);
      }
    }, 300); // Délai de 300ms

    // Nettoyage : Si l'utilisateur tape à nouveau avant les 300ms, on annule le timer précédent
    return () => clearTimeout(timer);

  }, [term]); // Se déclenche à chaque changement de 'term'

  // --- ACTIONS ---

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement complet de la page (comportement par défaut HTML)

    // Si le champ n'est pas vide (espaces inutiles retirés)
    if (term.trim()) {
      // On redirige vers la page de résultats avec le terme en paramètre d'URL "q"
      // Syntaxe demandée : /search?q={query}
      navigate(`/search?q=${term}`);
    }
  };
  // Quand on clique sur une suggestion
  const handleSuggestionClick = (mealName) => {
    setTerm(mealName); // Met le nom complet dans l'input
    setShowSuggestions(false); // Cache la liste
    navigate(`/search?q=${mealName}`); // Lance la recherche
  };
  return (
    <div className="search-bar-wrapper"> {/* Nouveau conteneur pour position relative */}
      {/* Balise <form> permet de valider avec la touche "Entrée" automatiquement */}
      <form onSubmit={handleSubmit} className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher une recette..."
          value={term}
          // À chaque appui sur une touche, on met à jour l'état "term"
          onChange={(e) => setTerm(e.target.value)}
          // On cache les suggestions si on clique ailleurs
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => term.length >= 2 && setShowSuggestions(true)}
        />
        <button type="submit" className="search-button">Rechercher</button>
      </form>

      {/* LISTE DES SUGGESTIONS */}
      {showSuggestions && (suggestions.startsWith.length > 0 || suggestions.contains.length > 0) && (
        <div className="suggestions-dropdown">

          {/* Groupe 1 : Commence par */}
          {suggestions.startsWith.length > 0 && (
            <div className="suggestion-group">
              <div className="group-title">COMMENCENT PAR "{term.toUpperCase()}"</div>
              {suggestions.startsWith.map(meal => (
                <div
                  key={meal.idMeal}
                  className="suggestion-item"
                  // onMouseDown est utilisé au lieu de onClick car il se déclenche avant le onBlur de l'input
                  onMouseDown={() => handleSuggestionClick(meal.strMeal)}
                >
                  <img src={meal.strMealThumb} alt="" className="thumb-mini" />
                  <span>{meal.strMeal}</span>
                </div>
              ))}
            </div>
          )}

          {/* Groupe 2 : Contient */}
          {suggestions.contains.length > 0 && (
            <div className="suggestion-group">
              {suggestions.startsWith.length > 0 && <div className="separator"></div>}
              <div className="group-title">CONTIENNENT "{term.toUpperCase()}"</div>
              {suggestions.contains.map(meal => (
                <div
                  key={meal.idMeal}
                  className="suggestion-item"
                  onMouseDown={() => handleSuggestionClick(meal.strMeal)}
                >
                  <img src={meal.strMealThumb} alt="" className="thumb-mini" />
                  <span>{meal.strMeal}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}