var poly;
var geodesicPoly;
var marker1;
var marker2;
var map;
//Additional variables
var startPos;
var endPos;
var markers = [];

// Geolocation variables

var options = {
  enableHighAvvccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
}

function setAllMap(map) {
  for (var i = markers.length - 1; i >= 0; i--) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setAllMap(null);
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function getJson(map) {
  var data;
  data = $.getJSON( "data/stations.json", function(dataJson) {
        dataJson.forEach( function(station) {
        var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: new google.maps.LatLng(station.Latitude, station.Longitude) 
        });
      });
      //return data;//Json.responseJSON;  
  });
  //console.log(data);
  return data;
}


function initialize() {
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(43.653921, -79.373217)
  };

  map = new google.maps.Map(document.getElementById('map_canvas'),
      mapOptions);

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      document.getElementById('info'));

  var data = getJson(map);
  // startPos = new google.maps.LatLng(43.642946, -79.394033);
  endPos = new google.maps.LatLng(43.653921, -79.373217);

<<<<<<< HEAD
 
=======
 var markers = [];
 $.getJSON( "data/stations.json", function( data ) {
          
          data.forEach( function(station) {
          var marker = new google.maps.Marker({
              map: map,
              draggable: true,
              position: new google.maps.LatLng(station.Latitude, station.Longitude) 
            });
        });
    });
>>>>>>> 233f1e1cb6026bcb711baf4546178a2456f1d863
  
  navigator.geolocation.getCurrentPosition(function(pos) {
      //console.dir(pos);

      startPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude); 

      // [END region_getplaces]

      console.log("DETERMINING STATION");
      DetermineClosestStation(startPos, data, function (closestStation) {
          DetermineClosestStation(endPos, data, function(closestStationEnd) {
              console.log ([closestStation, closestStationEnd]);
              marker1 = new google.maps.Marker({
                  map: map,
                  draggable: true,
                  position: new google.maps.LatLng(closestStation.Latitude, closestStation.Longitude) 
                });

              marker2 = new google.maps.Marker({
                  map: map,
                  draggable: true,
                  position: new google.maps.LatLng(closestStationEnd.Latitude, closestStationEnd.Longitude)
                    //43.647992, -79.370907)
                });

              var bounds = new google.maps.LatLngBounds(marker1.getPosition(),
              marker2.getPosition());
              map.fitBounds(bounds);

              google.maps.event.addListener(marker1, 'position_changed', update);
              google.maps.event.addListener(marker2, 'position_changed', update);

              console.dir(bounds);
              console.log(marker2);
              var polyOptions = {
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 3,
                map: map,
              };
              poly = new google.maps.Polyline(polyOptions);

              var geodesicOptions = {
                strokeColor: '#CC0099',
                strokeOpacity: 1.0,
                strokeWeight: 3,
                geodesic: true,
                map: map
              };
              geodesicPoly = new google.maps.Polyline(geodesicOptions);

              

              //showHeatMap(marker2.getPosition(), marker2.getPosition());
              //update();
            }
            );
          }
        );
    });
//showHeatMap(map);
}

function search(map) {
      // Create the search box and link it to the UI element.
      var input = /** @type {HTMLInputElement} */(
          document.getElementById('pac-input'));

      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */(input));

    // [START region_getplaces]
      // Listen for the event fired when the user selects an item from the
      // pick list. Retrieve the matching places for that item.
      google.maps.event.addListener(searchBox, 'places_changed', function() {
        
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }
        
        //console.log(places);
        // For each place, get the icon, place name, and location.
        
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
          var image = {
            url: place.icon,
            size: new google.maps.Size(20, 20),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(15, 15)
          };

          // Create a marker for each place.
          var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
          });

          markers.push(marker);

          bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
      });
      
      // Bias the SearchBox results towards places that are within the bounds of the
      // current map's viewport.
      google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
      });
}

function update() {
  var path = [marker1.getPosition(), marker2.getPosition()];
  poly.setPath(path);
  geodesicPoly.setPath(path);
  var heading = google.maps.geometry.spherical.computeHeading(path[0],
      path[1]);
  //document.getElementById('heading').value = heading;
  //document.getElementById('origin').value = path[0].toString();
  //document.getElementById('destination').value = path[1].toString();
}

function showHeatMap(origin, destination) {
  //var map_canvas = document.getElementById("map_canvas");
    var heatmap;
    var rendererOptions = {
      draggable: true
    };
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    //var origin = new google.maps.LatLng(43.666602, -79.403502);
    //var destination = new google.maps.LatLng(43.656278, -79.380803);

    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    //var map = new google.maps.Map(map_canvas, mapOptions);
    directionsDisplay.setMap(map);
    /* Set HeatMap */
    var bikeLayer = new google.maps.BicyclingLayer();
      bikeLayer.setMap(map);

      $.getJSON( 'accidents.json', function( data ) {
        var accidents = [];
        var i = 0;
          data.forEach( function(accident) {
            i++;
            if (accident.latitude&& accident.longitude) {
              
              accidents.push( new google.maps.LatLng(accident.latitude, accident.longitude) );
            }
            });

          var pointArray = new google.maps.MVCArray(accidents);
          console.log("MVCArray");
          heatmap = new google.maps.visualization.HeatmapLayer({
          data: pointArray,
          radius: 25
        });
          heatmap.setMap(map);
      });

    /******** Show Route *******/
    var request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.BICYCLING
    };
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
      }
    });
}

function DetermineClosestStation(position, data, cb) {
  //load dock data
  //console.dir(data);
  var closestStation = null;
  var closestStationDist = 0;
//console.dir(data);
  $.getJSON( "data/stations.json", function( data ) {
      //console.log(data);
      
      data.forEach( function(station) {
          var stationLatLng = new google.maps.LatLng(station.Latitude, station.Longitude); 
         // console.log(stationLatLng);

          var distance = google.maps.geometry.spherical.computeDistanceBetween(stationLatLng, position);

          if (!closestStation || closestStationDist > distance)
          {
            closestStationDist = distance;
            closestStation = station;
            //console.log("calculating closest: " + closestStation + ", " + "closestStationDist");
          }
       });
      //console.log("returning");
      cb(closestStation);
  });

}

google.maps.event.addDomListener(window, 'load', initialize);



// function initialize() {


  
// }
//       google.maps.event.addDomListener(window, 'load', initialize);