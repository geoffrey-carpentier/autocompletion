import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Importation du Header
import Header from './components/Header';
// Importation de nos pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import RecipeDetail from './pages/RecipeDetail';

function App() {
  return (
    // BrowserRouter englobe toute l'application pour activer le routage
    <BrowserRouter>
      <div className="App">
        {/* Header global (masqué sur la page d'accueil) */}
        <Header />
        
        {/* Routes agit comme un "switch" : il affiche le premier composant qui correspond à l'URL */}
        <Routes>
          {/* Route pour la page d'accueil (chemin racine "/") */}
          <Route path="/" element={<Home />} />

          {/* Route pour les résultats de recherche */}
          {/* On accèdera à cette page via /search */}
          <Route path="/search" element={<SearchResults />} />

          {/* Route pour les détails d'une recette */}
          {/* ":id" est un paramètre dynamique (ex: /recipe/52772) */}
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;