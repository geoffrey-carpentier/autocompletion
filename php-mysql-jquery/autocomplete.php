<?php
// Point d'entree AJAX interroge par le jQuery de la barre de recherche.
// Renvoie les suggestions en JSON, deja separees en deux groupes :
// - "commence_par" : le nom du Pokemon commence par la recherche
// - "contient"     : le nom contient la recherche mais ne commence pas par elle

require_once __DIR__ . '/config/db.php';

header('Content-Type: application/json; charset=utf-8');

$recherche = trim($_GET['q'] ?? '');

if ($recherche === '') {
    echo json_encode(['commence_par' => [], 'contient' => []]);
    exit;
}

// Premier groupe : les noms qui commencent par la recherche
$stmtDebut = $pdo->prepare('SELECT id, nom, type_principal FROM pokemons WHERE nom LIKE :recherche ORDER BY nom LIMIT 5');
$stmtDebut->execute(['recherche' => $recherche . '%']);
$commencePar = $stmtDebut->fetchAll(PDO::FETCH_ASSOC);

// Deuxieme groupe : les noms qui contiennent la recherche sans commencer par elle
$stmtContient = $pdo->prepare('SELECT id, nom, type_principal FROM pokemons WHERE nom LIKE :recherche AND nom NOT LIKE :debut ORDER BY nom LIMIT 5');
$stmtContient->execute(['recherche' => '%' . $recherche . '%', 'debut' => $recherche . '%']);
$contient = $stmtContient->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'commence_par' => $commencePar,
    'contient' => $contient,
]);
