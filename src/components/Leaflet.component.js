import React from "react"
import { View } from "react-native"
import { WebView } from 'react-native-webview'

export const leaflet = (latitude, longitude) => `
<!DOCTYPE html>
<html>

<head>
    <title>Leaflet sample</title>
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
    <style>
        html, body {
            height: 100%;
            width: 100%;
            overflow: hidden;
            padding: 0px;
            margin: 0px;
        }
        #map {
            width: auto;
            height: 100%;
        }
    </style>
</head>

<body>
    <div id="map"></div>
    <script>
        // Creating map options
        var mapOptions = {
            center: [${latitude}, ${longitude}],
            zoom: 18
        }
        // Creating a map object
        var map = new L.map('map', mapOptions);

        // Creating a Layer object
        var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

        // Adding layer to the map
        map.addLayer(layer);

        // Creating a marker
        var marker = L.marker([${latitude}, ${longitude}]);

        // Adding marker to the map
        marker.addTo(map);
    </script>
</body>

</html>
`

export const MapViewLeaflet = ({ latitude, longitude }) => {
    return (
        <View style={{ flex: 1 }}>
            {latitude && longitude && (
                <WebView
                    style={{ flex: 1 }}
                    source={{ html: leaflet(latitude, longitude) }}
                    originWhitelist={['*']}
                />
            )}
        </View>
    )
}