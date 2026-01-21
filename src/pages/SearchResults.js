import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'
import './SearchResults.css';

// Composant de la Page de Résultats (SearchResults)
export default function SearchResults() {
    // 1. Récupération du paramètre 'q' dans l'URL (?q=...)
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    // 2. Etats pour gérer les données et l'interface
    const [recipes, setRecipes] = useState([]);     // Stocke la liste des recettes récupérées
    const [loading, setLoading] = useState(false);  // Gère l'affichage du chargement
    const [error, setError] = useState(null);       // Gère les erreurs éventuelles

    // 3. useEffect : Se déclenche pour lancer la recherche à chaque changement de 'query'
    useEffect(() => {       // fonction flechée p
        // Si aucune requête, alors on ne fait rien
        if (!query) return;

        const fetchRecipes = async () => {
            setLoading(true); // Début du chargement
            setError(null);   // Reset des erreurs
      
        try {
            // Appel à l'API TheMealDB [cite: 5]
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();

            // L'API renvoie "meals": null si rien n'est trouvé, on gère ce cas avec || []
            setRecipes(data.meals || []); 
        }   catch (err) {
            console.error("Erreur API:", err);
            setError("Une erreur est survenue lors de la récupération des recettes.");
        }   finally {
            setLoading(false); // Fin du chargement (succès ou échec)
        }
    };

    fetchRecipes();
  }, [query]); // Dépendance : l'effet se relance si 'query' change

  return (
    <div className="search-results-container">
      <h2 className="results-title">
        Résultats pour "<span className="highlight">{query}</span>"
      </h2>

      {/* Affichage conditionnel : Chargement */}
      {loading && <div className="loader">Chargement des recettes...</div>}

      {/* Affichage conditionnel : Erreur */}
      {error && <div className="error-message">{error}</div>}

      {/* Affichage conditionnel : Pas de résultats */}
      {!loading && !error && recipes.length === 0 && (
        <p className="no-results">Aucune recette trouvée pour cette recherche.</p>
      )}

      {/* Affichage de la grille de résultats */}
      <div className="recipes-grid">
        {recipes.map((meal) => (
          // Link permet de cliquer sur une carte pour aller vers les détails de la recette
          <Link to={`/recipe/${meal.idMeal}`} key={meal.idMeal} className="recipe-card">
            <div className="card-image-container">
                <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
            </div>
            <div className="card-info">
              <h3>{meal.strMeal}</h3>
              <span className="category-tag">{meal.strCategory}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}



/*
//   return (
//     <div className="search-results">
//       <h1>Résultats de recherche</h1>
//       <p>La liste des recettes s'affichera ici.</p>
//     </div>
//   );
// }
*/