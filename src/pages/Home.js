/*
// import React from 'react';
// import './Home.css';

// export default function Home() {
//   return (
//     <div className="home-container">
//       <h1>Page d'Accueil</h1>
//       <p> Barre de recherche à venir.</p>
//     </div>
//   );
// }  
*/

import React from 'react';
import SearchBar from '../components/SearchBar'; // On importe le composant SearchBar
import './Home.css';

// Composant de la Page d'Accueil (Home)
export default function Home() {
  return (
    <div className="home-container">
      {/* Logo / Titre principal */}
      <h1 className="main-title">
        <span className="blue">Good</span><span className="orange">Food</span>
      </h1>
      
      {/* Sous-titre */}
      <p className="subtitle">
        Trouvez votre prochaine recette parmi les milliers de plats disponibles !
      </p>

      {/* Intégration de la barre de recherche */}
      <div className="search-wrapper">
        <SearchBar />
      </div>
    </div>
  );
}