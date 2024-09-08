
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.scss';

// require jQuery normally
const $ = require('jquery');

// create global $ and jQuery variables
global.$ = global.jQuery = $;


$(function () {

    window.geojson = [];
    var geojsonLayer = null;  // Déclarer la couche GeoJSON comme null

    var map = L.map('map').setView([47.700000, 2.633333], 8);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    fetch('/geojson/polluant_J0.geojson')
        .then(response => response.json())
        .then(data => {
            geojson = data;
            updateGeoJSONLayer(); // Mettre à jour la carte lorsque l'utilisateur change la colonne

        });

    // Initialiser la couche GeoJSON
    updateGeoJSONLayer();

    // Fonction pour obtenir une couleur selon une valeur (ici la densité de population)
    function getColor(d) {
        return d > 5 ? '#872181' :
            d > 4 ? '#960062' :
                d > 3 ? '#FF5050' :
                    d > 2 ? '#F0E641' :
                        d > 1 ? '#50CCAA' :
                            '#50F0E6';
    }

    // Fonction de style pour chaque entité
    function style(feature, valeur) {
        // Obtenir la colonne sélectionnée
        var selectedColumn = document.querySelector('input[name="polluant"]:checked').value;

        return {
            fillColor: getColor(feature.properties[selectedColumn], selectedColumn),
            weight: 2,
            opacity: 0,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.8
        };
    }

    // Fonction pour ajouter ou mettre à jour le GeoJSON sur la carte
    function updateGeoJSONLayer() {
        // Si la couche GeoJSON existe déjà, la retirer
        if (geojsonLayer) {
            map.removeLayer(geojsonLayer);
        }
        // Ajouter la nouvelle couche GeoJSON avec le style mis à jour
        geojsonLayer = L.geoJSON(geojson, { style: style }).addTo(map);
    }


    // Changement du polluant pris en compte
    $('#radio').on('change', function () {
        updateGeoJSONLayer(); // Mettre à jour la carte lorsque l'utilisateur change la colonne
    })

});
