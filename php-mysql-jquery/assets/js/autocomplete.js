$(function () {
    const $input = $('#search-input');
    const $suggestions = $('#suggestions');
    let requeteEnCours = null;

    function viderSuggestions() {
        $suggestions.empty().hide();
    }

    function afficherSuggestions(data) {
        $suggestions.empty();

        const aDesResultats = data.commence_par.length > 0 || data.contient.length > 0;
        if (!aDesResultats) {
            viderSuggestions();
            return;
        }

        // Premier groupe : les noms qui commencent par la recherche
        data.commence_par.forEach(function (pokemon) {
            $('<a>')
                .addClass('suggestion-item')
                .attr('href', 'element.php?id=' + pokemon.id)
                .text(pokemon.nom + ' (' + pokemon.type_principal + ')')
                .appendTo($suggestions);
        });

        // Separation visuelle entre les deux groupes, uniquement si les deux existent
        if (data.commence_par.length > 0 && data.contient.length > 0) {
            $('<div>').addClass('suggestion-separator').appendTo($suggestions);
        }

        // Second groupe : les noms qui contiennent la recherche
        data.contient.forEach(function (pokemon) {
            $('<a>')
                .addClass('suggestion-item')
                .attr('href', 'element.php?id=' + pokemon.id)
                .text(pokemon.nom + ' (' + pokemon.type_principal + ')')
                .appendTo($suggestions);
        });

        $suggestions.show();
    }

    $input.on('keyup', function () {
        const recherche = $input.val().trim();

        if (recherche.length === 0) {
            viderSuggestions();
            return;
        }

        // On annule la requete precedente si l'utilisateur tape vite
        if (requeteEnCours) {
            requeteEnCours.abort();
        }

        requeteEnCours = $.ajax({
            url: 'autocomplete.php',
            data: { q: recherche },
            dataType: 'json',
            success: afficherSuggestions,
        });
    });

    $input.on('keydown', function (event) {
        if (event.key === 'Enter') {
            window.location.href = 'recherche.php?search=' + encodeURIComponent($input.val().trim());
        }
    });

    // Fermeture des suggestions si on clique en dehors de la barre de recherche
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.search-wrapper').length) {
            viderSuggestions();
        }
    });
});
