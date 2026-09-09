# Autocompletion

**Note** : Ce projet a été réalisé dans le cadre de ma formation de Développeur Web et Web Mobile (DWWM) au sein de La Plateforme.

Le sujet demandait une barre de recherche avec autocomplétion, dans une stack imposée PHP/MySQL/jQuery. Le développement du projet a d'abord démarré en React, avant de repartir sur la stack imposée par le sujet. Les deux versions sont conservées dans ce dépôt :

- [`php-mysql-jquery/`](php-mysql-jquery) : la version conforme au sujet (PHP, MySQL, jQuery), thème Pokémon.
- [`src/`](src) (racine du dépôt) : la version React développée initialement, thème recettes de cuisine, basée sur l'API publique TheMealDB.

## Version PHP / MySQL / jQuery (conforme au sujet)

Voir [`php-mysql-jquery/`](php-mysql-jquery).

- Base de données `autocompletion`, table `pokemons` (28 entrées).
- Pages `index.php`, `recherche.php?search=`, `element.php?id=`.
- Barre de recherche jQuery interrogeant `autocomplete.php` en AJAX, résultats répartis en deux groupes (commence par / contient), avec une séparation visuelle entre les deux.

### Installation

1. Importer `php-mysql-jquery/database/autocompletion.sql` dans votre serveur MySQL.
2. Configurer l'accès à la base si besoin via les variables d'environnement `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` (valeurs par défaut : `localhost`, `3306`, `autocompletion`, `root`, vide).
3. Servir le dossier `php-mysql-jquery/` avec un serveur PHP (Apache/Nginx, ou en local `php -S localhost:8000` depuis ce dossier).

## Version React (recherche de recettes)

Application de recherche de recettes de cuisine basée sur l'API publique TheMealDB, avec autocomplétion divisée en deux groupes (recettes commençant par la saisie, puis recettes la contenant), navigation au clavier, et pages de détail par recette.

### Stack technique

- React 19 (Create React App)
- React Router DOM
- Fetch API native
- API distante : [TheMealDB](https://www.themealdb.com/api.php)

### Installation et lancement local

```bash
npm install
npm start
```

L'application est accessible sur `http://localhost:3000`.

### Structure

```text
src/
├── components/
│   ├── Header.js          En-tete global incluant la barre de recherche
│   └── SearchBar.js       Logique d'autocompletion (debounce, groupes, navigation clavier)
├── pages/
│   ├── Home.js            Page d'accueil
│   ├── SearchResults.js   Grille de resultats
│   └── RecipeDetail.js    Fiche detaillee d'une recette
├── App.js                 Configuration du routage
└── index.js               Point d'entree
```

## Lien du dépôt

https://github.com/geoffrey-carpentier/autocompletion
