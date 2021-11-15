// API endpoint to consume
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// create initial map
var map = L.map("map", {
    center: [40.7, -94.5],
    zoom: 2,
  });

// add background map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(map);

// define a function to set the size of each earthquake data point based on magnitude
function quakesize(magnitude) {
    console.log(magnitude);
    if (magnitude === 0) {
        return 1;
    };
    if (magnitude != 0) {
        return magnitude * 5;
    }
};

// define a function to color each earthquake data point based on depth
function quakecolor(depth) {
    console.log(depth);
    switch (true) {
    case magnitude > 5:
        return "#ea2c2c";
    case magnitude > 4:
        return "#ea822c";
    case magnitude > 3:
        return "#ee9c00";
    case magnitude > 2:
        return "#eecc00";
    case magnitude > 1:
        return "#d4ee00";
    default:
        return "#98ee00";
    }
};

// function to format each data point
function format(feature) {
    return {
        opacity: .7,
        fillOpacity: 1,
        fillColor: quakecolor(feature.geometry.depth),
        color: "#000000",
        radius: quakesize(feature.properties.magnitude),
        stroke: true,
        weight: 0.5
    }
};

// consume API to get data points and put them on the map
d3.json(earthquakeURL, function(data) {
    // setup geojson layer
    L.geoJson(data, {
        // plot the circle on the map
        pointToLayer: function(feature, data) {
            return L.circleMarker(latlng);
        },
        // set the circle style and add a popup 
        style: format,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag +"<br>Location: " + feature.properties.place);
        }
    }).addTo(map);
});
