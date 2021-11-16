// API endpoint to consume
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(earthquakeURL).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // define a function to set the size of each earthquake data point based on magnitude
  function quakesize(mag) {
    //console.log(mag);
    if (mag == 0) {
        return 1;
    };
    if (mag != 0) {
        return mag * 6;
    };
  };

  // define a function to color each earthquake data point based on depth
  function quakecolor(depth) {
    //console.log(depth);
    switch (true) {
    case depth > 90:
        return "red";
    case depth > 70:
        return "orangered";
    case depth > 50:
        return "orange";
    case depth > 30:
        return "gold";
    case depth > 10:
        return "yellow";
    default:
        return "lightgreen";
    };
  };
  var quakecircles =  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
    //console.log(latlng)
    return L.circleMarker(latlng, {
           radius: quakesize(feature.properties.mag),
           fillColor: quakecolor(feature.geometry.coordinates[2]),
           fillOpacity: 0.7,
           color: "black",
           stroke: true,
           weight: 1.5
    });
    },   
  });

  // Sending our earthquakes layer to the createMap functio
  createMap(quakecircles);

}

function createMap(earthquakes) {
    // Define lightmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [ 37.09, -95.71 ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}

// // create initial map
// var map = L.map("map", {
//     center: [40.7, -94.5],
//     zoom: 2,
//     layers: [lightmap, earthquakes]
// });

//     // define a function to set the size of each earthquake data point based on magnitude
//     function quakesize(mag) {
//         console.log(mag);
//         if (mag == 0) {
//             return 1;
//         };
//         if (mag != 0) {
//             return mag * 10;
//         };
//     };

//     // define a function to color each earthquake data point based on depth
//     function quakecolor(depth) {
//         console.log(depth);
//         switch (true) {
//         case depth > 90:
//             return "red";
//         case depth > 70:
//             return "orangered";
//         case depth > 50:
//             return "orange";
//         case depth > 30:
//             return "gold";
//         case depth > 10:
//             return "yellow";
//         default:
//             return "lightgreen";
//         };
//     };

//     // consume API to get data points and put them on the map
//     L.geoJSON(data, {
//         pointToLayer: function (feature, latlng) {
//         console.log(latlng)
//         return L.circleMarker(latlng, {
//           radius: quakesize(feature.properties.mag),
//           fillColor: quakecolor(feature.geometry.coordinates[2]),
//           fillOpacity: 0.7,
//           color: "black",
//           stroke: true,
//           weight: 1.5
//         }
//       );
//     },
//     onEachFeature: function(feature, layer) {
//       layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
//       + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
//     }
// }).addTo(earthquakes);
// // add earthquake layer to the map
// earthquakes.addTo(map);
// });
//
