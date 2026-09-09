<?php require_once __DIR__ . '/config/db.php'; ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Fiche Pokemon - Pokedex</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include __DIR__ . '/includes/header.php'; ?>

    <main class="element">
        <?php
        $id = (int) ($_GET['id'] ?? 0);

        if ($id <= 0) {
            echo '<p class="empty">Identifiant invalide.</p>';
        } else {
            $stmt = $pdo->prepare('SELECT * FROM pokemons WHERE id = :id');
            $stmt->execute(['id' => $id]);
            $pokemon = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$pokemon) {
                echo '<p class="empty">Aucun Pokemon ne correspond a cet identifiant.</p>';
            } else {
                $types = htmlspecialchars($pokemon['type_principal']);
                if (!empty($pokemon['type_secondaire'])) {
                    $types .= ' / ' . htmlspecialchars($pokemon['type_secondaire']);
                }
                echo '<article class="element-card">';
                echo '<p class="element-number">N&deg; ' . (int) $pokemon['numero_pokedex'] . '</p>';
                echo '<h1 class="element-name">' . htmlspecialchars($pokemon['nom']) . '</h1>';
                echo '<p class="element-type">' . $types . '</p>';
                echo '<p class="element-description">' . htmlspecialchars($pokemon['description']) . '</p>';
                echo '</article>';
            }
        }
        ?>
    </main>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="assets/js/autocomplete.js"></script>
</body>
</html>
