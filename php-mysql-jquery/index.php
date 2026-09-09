<?php require_once __DIR__ . '/config/db.php'; ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Pokedex - Autocompletion</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include __DIR__ . '/includes/header.php'; ?>

    <main class="home">
        <h1 class="home-title">Pokedex</h1>
        <p class="home-subtitle">Recherchez un Pokemon par son nom dans la barre ci-dessus.</p>
    </main>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="assets/js/autocomplete.js"></script>
</body>
</html>
