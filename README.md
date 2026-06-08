# GoodFood - Recherche de Recettes avec Autocomplétion 🍳

Un projet React de moteur de recherche de recettes de cuisine basé sur l'API publique gratuite **TheMealDB**. Ce projet met particulièrement l'accent sur le développement d'une fonctionnalité d'**autocomplétion intelligente** et sur l'expérience utilisateur (UX) lors de la saisie.

## 🌟 Fonctionnalités

- **Autocomplétion Intelligente** : Les suggestions sont divisées en deux catégories pour plus de pertinence :
  1. Les recettes commençant exactement par la frappe de l'utilisateur.
  2. Les recettes contenant la frappe, n'importe où dans le nom.
- **Optimisation des performances (Debounce)** : Un délai (*debounce* de 300ms) est appliqué sur l'input pour éviter de surcharger l'API à chaque caractère tapé.
- **Navigation au clavier** : Possibilité de naviguer dans les suggestions avec les flèches haut/bas, de valider avec `Entrée`, et de fermer la liste avec `Échap`.
- **Routage Dynamique** : Navigation fluide côté client via `react-router-dom` (Page d'accueil, Page de résultats de recherche, Page de détails de la recette).
- **Détails Complets** : Affichage des instructions, des images, et combinaison dynamique des ingrédients avec leurs mesures exactes.

## 🛠️ Stack Technique

- **Frontend** : React 19 (Initialisé via Create React App)
- **Routage** : React Router DOM (v7)
- **Requêtes API** : Fetch API (Native)
- **Gestion d'état** : Hooks React (`useState`, `useEffect`)
- **API Distante** : [TheMealDB](https://www.themealdb.com/api.php)

## 🚀 Installation et Lancement local

### Prérequis

- [Node.js](https://nodejs.org/) (et son gestionnaire NPM) installé sur votre machine.

### Instructions

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/geoffrey-carpentier/autocompletion.git
   cd autocompletion
   ```
2. **Installer les dépendances**

   ```bash
   npm install
   ```
3. **Lancer le serveur de développement**

   ```bash
   npm start
   ```

   L'application sera accessible sur `http://localhost:3000`.

## 📁 Structure du Projet (Principaux éléments)

```text
src/
├── components/
│   ├── Header.js          # En-tête global incluant la barre de recherche
│   └── SearchBar.js       # Composant complexe gérant la logique d'autocomplétion
├── pages/
│   ├── Home.js            # Page d'accueil centrée style "Moteur de recherche"
│   ├── SearchResults.js   # Grille de résultats après validation d'une requête
│   └── RecipeDetail.js    # Fiche complète d'une recette (ingrédients, instructions)
├── App.js                 # Configuration du routage
└── index.js               # Point d'entrée de l'application
```

## 🧠 Concepts Techniques Abordés

- **Manipulation des tableaux JS** : Utilisation de `.filter()`, `.startsWith()`, `.includes()`, et `.slice()` pour diviser et ordonner les résultats de l'autocomplétion.
- **Gestion du Cycle de Vie** : Utilisation de `useEffect` pour déclencher les appels asynchrones à l'API TheMealDB en fonction des modifications de la valeur d'entrée.
- **Événements Clavier** : Écoute du `onKeyDown` pour améliorer l'accessibilité du formulaire sans l'usage de la souris.

---

*Projet réalisé dans le cadre de la formation Développeur Web et Web Mobile à La Plateforme_.*
