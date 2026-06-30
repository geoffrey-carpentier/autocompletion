import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

/**
 * Render a search bar that provides debounced autocomplete suggestions from TheMealDB and navigates to search results.
 *
 * The component maintains the current input, shows a dropdown of up to 5 suggestions that either start with or contain the query (two separate groups), debounces network requests by 300ms, and navigates to `/search?q=...` on form submit or when a suggestion is chosen. The suggestions dropdown is hidden for short queries and dismissed on blur.
 *
 * @returns {JSX.Element} The SearchBar UI element.
 */
export default function SearchBar() {
    const [term, setTerm] = useState('');
    // État pour stocker les suggestions triées (startsWith et contains)
    const [suggestions, setSuggestions] = useState({ startsWith: [], contains: [] });
    // État pour afficher ou masquer la liste des suggestions
    const [showSuggestions, setShowSuggestions] = useState(false);
    // 2. Hook pour permettre la navigation (redirection) sans recharger la page
    const navigate = useNavigate();

    // --- ALGORITHME DE TRI (Job 05)---
    const filterSuggestions = (meals, query) => {
        if (!meals) return { startsWith: [], contains: [] };

        const lowerQuery = query.toLowerCase();

        // 1. Ceux qui COMMENCENT par la recherche (ex: "Chi" -> "Chicken...")
        const startsWith = meals.filter(meal =>
            meal.strMeal.toLowerCase().startsWith(lowerQuery)
        ).slice(0, 5); // On en garde 5 max

        // 2. Ceux qui CONTIENNENT la recherche mais ne commencent pas par elle (ex: "Chi" -> "Spicy Chicken...")
        const contains = meals.filter(meal => {
            const name = meal.strMeal.toLowerCase();
            return name.includes(lowerQuery) && !name.startsWith(lowerQuery);
        }).slice(0, 5); // On en garde 5 max

        return { startsWith, contains };
    };

    // --- GESTION DE LA FRAPPE ET DEBOUNCE (Job 04) ---
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
        e.preventDefault();
        if (term.trim()) { //
            setShowSuggestions(false); // On cache les suggestions
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
            <form onSubmit={handleSubmit} className="search-bar-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Rechercher une recette (ex: chicken)..."
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    // On cache les suggestions si on clique ailleurs (optionnel simple pour l'instant)
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