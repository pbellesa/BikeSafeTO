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

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
  var infoWindow;
  /* Sets the inital location of the map, so as not to start in the middle of the atlantic ocean! */
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(43.653921, -79.373217)
  };

  map = new google.maps.Map(document.getElementById('map_canvas'),
      mapOptions);

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      document.getElementById('info'));
 
  startPos = new google.maps.LatLng(43.642946, -79.394033);

  endPos = new google.maps.LatLng(43.653921, -79.373200);

  var bounds = new google.maps.LatLngBounds(startPos, endPos);
  map.fitBounds(bounds);

  setDirections();
  setBikeLayer();
  setDirections();  // ADDED DIRECTIONS
  infoWindow = new google.maps.InfoWindow({ content: "Holding..."});
  
  $.getJSON( "data/stations.json", function( data ) {
          
        data.forEach( function(station) {
          var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: new google.maps.LatLng(station.Latitude, station.Longitude) 
          });

          // display station name when clicked
          google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent(station["Station Name"]);
            infoWindow.open(map, this);
            //map.fitBounds(bounds);
          });

          // recenter map to the marker which was clicked
          google.maps.event.addListener(marker, 'dblclick', function() {
            map.setZoom(14);
            map.setCenter(marker.getPosition());
          });

        });

        $("#input-go").click( function(){
          
          var geocoder = new google.maps.Geocoder();

          geocoder.geocode({'address': $("#input-from").val()}, function(results, status) {
            var fromLatlng = results[0].geometry.location;
            //console.log(fromLatlng);
            geocoder.geocode({'address': $("#input-to").val()}, function(results, status) {
              var toLatlng = results[0].geometry.location;
              //console.log(toLatlng);
              DetermineClosestStation(fromLatlng, function (closestStation) {
                
                DetermineClosestStation(toLatlng, function(closestStationEnd) {
                  //console.log ([closestStation, closestStationEnd]);
                  marker1 = new google.maps.Marker({
                      map: map,
                      draggable: true,
                      position: new google.maps.LatLng(closestStation.Latitude, closestStation.Longitude) 
                    });

                  marker2 = new google.maps.Marker({
                      map: map,
                      draggable: true,
                      position: new google.maps.LatLng(closestStationEnd.Latitude, closestStationEnd.Longitude)
                    });

                  var bounds = new google.maps.LatLngBounds(marker1.getPosition(),
                  marker2.getPosition());
                  map.fitBounds(bounds);

                  google.maps.event.addListener(marker1, 'position_changed', update);
                  google.maps.event.addListener(marker2, 'position_changed', update);

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

                  calcRoute(marker1.getPosition(), marker2.getPosition());
                });
              });
            });     
          }); 

        return false;
      });

    });
}




function setBikeLayer() {

      var bikeLayer = new google.maps.BicyclingLayer();

        bikeLayer.setMap(map);

        $.getJSON( 'data/accidents.json', function( data ) {
          var accidents = [];
          var i = 0;
            data.forEach( function(accident) {
              i++;
              if (accident.latitude && accident.longitude) {
                
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
    }

function update() {
  //var path = [marker1.getPosition(), marker2.getPosition()];
  
  // poly.setPath(path);
  // geodesicPoly.setPath(path);
  // var heading = google.maps.geometry.spherical.computeHeading(path[0],
  //     path[1]);
}



function DetermineClosestStation(position, cb) {
  $.getJSON( "data/stations.json", function( data ) {      
      var closestStation = null;
       var closestStationDist = 0;
        data.forEach( function(station) {
            var stationLatLng = new google.maps.LatLng(station.Latitude, station.Longitude); 
           // console.log(stationLatLng);

            var distance = google.maps.geometry.spherical.computeDistanceBetween(stationLatLng, position);

            if (!closestStation || closestStationDist > distance)
            {
              closestStationDist = distance;
              closestStation = station;
              console.log(closestStation);
              //console.log("calculating closest: " + closestStation + ", " + "closestStationDist");
            }

          });
        cb(closestStation);
    });
}

function setDirections(){
  var rendererOptions = {
    draggable: true
  };
  directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);      
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions_panel'));
}

function calcRoute(origin, destination) {
  $("#wrapper_directions").css( "display", "block");
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



google.maps.event.addDomListener(window, 'load', initialize);


