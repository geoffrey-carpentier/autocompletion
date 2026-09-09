<?php require_once __DIR__ . '/config/db.php'; ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Resultats de recherche - Pokedex</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include __DIR__ . '/includes/header.php'; ?>

    <main class="results">
        <?php
        $recherche = trim($_GET['search'] ?? '');

        if ($recherche === '') {
            echo '<p class="empty">Saisissez un terme dans la barre de recherche.</p>';
        } else {
            $stmt = $pdo->prepare('SELECT id, nom, type_principal, type_secondaire FROM pokemons WHERE nom LIKE :recherche ORDER BY nom');
            $stmt->execute(['recherche' => '%' . $recherche . '%']);
            $resultats = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo '<h1 class="results-title">Resultats pour "' . htmlspecialchars($recherche) . '"</h1>';

            if (count($resultats) === 0) {
                echo '<p class="empty">Aucun Pokemon ne correspond a cette recherche.</p>';
            } else {
                echo '<ul class="results-list">';
                foreach ($resultats as $pokemon) {
                    $types = htmlspecialchars($pokemon['type_principal']);
                    if (!empty($pokemon['type_secondaire'])) {
                        $types .= ' / ' . htmlspecialchars($pokemon['type_secondaire']);
                    }
                    echo '<li class="results-item">';
                    echo '<a href="element.php?id=' . (int) $pokemon['id'] . '">';
                    echo '<span class="results-name">' . htmlspecialchars($pokemon['nom']) . '</span>';
                    echo '<span class="results-type">' . $types . '</span>';
                    echo '</a>';
                    echo '</li>';
                }
                echo '</ul>';
            }
        }
        ?>
    </main>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="assets/js/autocomplete.js"></script>
</body>
</html>
