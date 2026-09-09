-- Base de données du projet Autocompletion (theme Pokemon)
-- Export genere localement, a importer via phpMyAdmin / MySQL Workbench / ligne de commande.

CREATE DATABASE IF NOT EXISTS autocompletion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autocompletion;

DROP TABLE IF EXISTS pokemons;

CREATE TABLE pokemons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    type_principal VARCHAR(30) NOT NULL,
    type_secondaire VARCHAR(30) DEFAULT NULL,
    description TEXT NOT NULL,
    numero_pokedex INT NOT NULL
);

INSERT INTO pokemons (nom, type_principal, type_secondaire, description, numero_pokedex) VALUES
('Bulbizarre', 'Plante', 'Poison', 'Un Pokemon graine qui grandit en absorbant la lumiere du soleil.', 1),
('Herbizarre', 'Plante', 'Poison', 'La fleur sur son dos degage un parfum agreable des qu elle s ouvre.', 2),
('Florizarre', 'Plante', 'Poison', 'La lumiere du soleil renforce la fleur sur son dos et la rend plus colorée.', 3),
('Salameche', 'Feu', NULL, 'Depuis sa naissance, une flamme brule au bout de sa queue.', 4),
('Reptincel', 'Feu', NULL, 'Il agite violemment sa queue enflammee pour intimider ses adversaires.', 5),
('Dracaufeu', 'Feu', 'Vol', 'Il crache des flammes qui peuvent faire fondre n importe quel materiau.', 6),
('Carapuce', 'Eau', NULL, 'Apres sa naissance, son dos se durcit et forme une carapace.', 7),
('Carabaffe', 'Eau', NULL, 'Il se sert de la mousse qui s echappe de son corps pour ralentir ses ennemis.', 8),
('Tortank', 'Eau', NULL, 'Les canons a eau caches dans sa carapace ont une precision redoutable.', 9),
('Chenipan', 'Insecte', NULL, 'Ses pattes courtes sont recouvertes de nombreuses petites ventouses.', 10),
('Aspicot', 'Insecte', 'Poison', 'Il attaque frequemment en utilisant son dard empoisonne.', 13),
('Roucool', 'Normal', 'Vol', 'Un Pokemon docile qui prefere fuir plutot que se battre.', 16),
('Rattata', 'Normal', NULL, 'Il ronge tout ce qu il trouve, ce qui use continuellement ses dents.', 19),
('Pikachu', 'Electrik', NULL, 'Quand plusieurs individus se rassemblent, leur electricite peut provoquer des orages.', 25),
('Raichu', 'Electrik', NULL, 'Sa queue lui sert de mise a la terre pour se proteger de sa propre puissance.', 26),
('Sabelette', 'Sol', NULL, 'Il vit dans les zones arides et se roule en boule pour se proteger.', 27),
('Nidoran F', 'Poison', NULL, 'Bien que petit, il peut secreter un poison puissant par ses cornes.', 29),
('Nidoran M', 'Poison', NULL, 'Il dresse ses grandes oreilles pour detecter le moindre signe de danger.', 32),
('Melofee', 'Fee', NULL, 'On raconte que des couples qui se voient sous la pleine lune seront heureux.', 35),
('Goupix', 'Feu', NULL, 'Il possede six queues magnifiques qui deviennent encore plus belles en vieillissant.', 37),
('Ramoloss', 'Eau', 'Psy', 'Ses reactions sont si lentes qu il ne sent meme pas la douleur.', 79),
('Machoc', 'Combat', NULL, 'Son corps est comme un amas de muscles ininterrompu.', 66),
('Abo', 'Poison', NULL, 'Il se deplace en silence et attaque par surprise en pleine nuit.', 23),
('Ponyta', 'Feu', NULL, 'Sa criniere brulante est plus resistante et plus chaude qu une flamme normale.', 77),
('Magicarpe', 'Eau', NULL, 'Un Pokemon presque inutile au combat, mais capable de faire des bonds impressionnants.', 129),
('Leviator', 'Eau', 'Vol', 'Autrefois crainte pour sa capacite a detruire des villes entieres sous la colere.', 130),
('Evoli', 'Normal', NULL, 'Sa structure genetique instable lui permet d evoluer de multiples facons.', 133),
('Ronflex', 'Normal', NULL, 'Il ne fait que manger et dormir, et son poids ne cesse d augmenter.', 143);
