//! Composant de la Page de Détails d'une recette

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipeDetail.css';

export default function RecipeDetail() {
  const { id } = useParams(); // Récupère l'ID depuis l'URL (ex: 52772)
  const navigate = useNavigate(); // Pour le bouton "Retour"
  
  const [recipe, setRecipe] = useState(null); // État pour stocker les détails de la recette
  const [loading, setLoading] = useState(true); // État pour la gestion du chargement
  const [error, setError] = useState(null); // État pour la gestion des erreurs
  // Fonction utilitaire pour récupérer les ingrédients et mesures
  const getIngredients = (meal) => {
    const ingredients = [];
    // L'API fournit jusqu'à 20 ingrédients
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      // On ne garde que les ingrédients 'non vides'
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient,
          measure: measure || ''
        });
      }
    }
    return ingredients;
  };

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        
        const data = await response.json();
        
        if (data.meals) {
          setRecipe(data.meals[0]);// L'API renvoie un tableau, on prend le premier élément
        } else {
          setError('Recette introuvable');
        }
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError("Erreur lors du chargement de la recette");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetail();
  }, [id]);

  if (loading) return <div className="loader" role="status">Chargement des détails...</div>;
  if (error) return <div className="error" role="alert">{error}</div>;
  if (!recipe) return <div className="error">Recette introuvable.</div>;

  const ingredients = getIngredients(recipe);

  return (
    <div className="detail-container">
      {/* Bouton retour */}
      <button 
        onClick={() => navigate(-1)} 
        className="back-btn"
        aria-label="Retour à la page précédente"
      >
        ← Retour aux résultats
      </button>

      <div className="recipe-header">
        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="detail-img" />
        
        <div className="header-info">
          <h1>{recipe.strMeal}</h1>
          <div className="tags">
            <span className="tag category">{recipe.strCategory}</span>
            <span className="tag area">{recipe.strArea}</span>
          </div>
        </div>
      </div>

      <div className="recipe-content">
        {/* Colonne Ingrédients */}
        <div className="ingredients-section">
          <h2>Ingrédients</h2>
          <ul className="ingredients-list">
            {ingredients.map((item, index) => (
              <li key={index}>
                <span className="measure">{item.measure}</span>
                <span className="name">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne Instructions */}
        <div className="instructions-section">
          <h2>Instructions</h2>
          {/* On affiche les instructions en respectant les sauts de ligne */}
          <p className="instructions-text">
            {recipe.strInstructions}
          </p>
        </div>
      </div>
    </div>
  );
}