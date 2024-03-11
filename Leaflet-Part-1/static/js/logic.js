// Initialize the map
let myMap = L.map('map', {
    center:[39.8283,-98.5795],
    zoom: 5
});

// Add the base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load earthquake data and add markers to the map
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Function to determine marker color by depth
function markerColor(depth){
    if (depth < 10) return "#00FF00";
    else if (depth < 30) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "#FF0000";
}

// Function to determine marker size
function chooseSize(magnitude) {
    return magnitude * 3;
}

// Function to create circle markers with popups
function createMarker(feature, latlng) {
    var magnitude = feature.properties.mag;
    var depth = feature.geometry.coordinates[2];
    var markerOptions = {
        radius: chooseSize(magnitude),
        fillColor: markerColor(depth),
        color: "black",
        weight: 1,
        opacity: .6,
        fillOpacity: 0.8
    };
    var marker = L.circleMarker(latlng, markerOptions);
    marker.bindPopup(`<b>Location:</b> ${feature.properties.place}<br>
                      <b>Magnitude:</b> ${magnitude}<br>
                      <b>Depth:</b> ${depth} km`);
    return marker;
}

d3.json(url).then(function(data){
    console.log(data);
    L.geoJSON(data, {
        pointToLayer: createMarker
    }).addTo(myMap);
    console.log(myMap)

    // Add legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var legendDiv = L.DomUtil.create("div", "info legend"),
            depth = [-10, 10, 30, 50, 70, 90];
    
        for (var i = 0; i < depth.length; i++) {
            legendDiv.innerHTML +=
                '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return legendDiv;
    };
    legend.addTo(myMap);
  
});
