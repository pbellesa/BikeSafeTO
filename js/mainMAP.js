    var heatmap;
    var infoWindow = null;
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var origin = new google.maps.LatLng(43.666602, -79.403502);
    var destination = new google.maps.LatLng(43.656278, -79.380803);
    var map;
    var markers = [];
    var isRoutingActive = false;
    var route = [];
    function initialize() {
      var map_canvas = document.getElementById("map_canvas");
      var mapOptions = {
        center: new google.maps.LatLng(43.658938, -79.392812),
        zoom: 14,
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      };
      map = new google.maps.Map(map_canvas, mapOptions);
      setDirections();
      setBikeLayer();
      setStations();
      setSearchBox();
    }

    function setDirections(){
      var rendererOptions = {
        draggable: true
      };
      directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);      
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById('directions_panel'));
    }

    function setBikeLayer(){

      var bikeLayer = new google.maps.BicyclingLayer();

        bikeLayer.setMap(map);

        $.getJSON( 'data/accidents.json', function( data ) {
          var accidents = [];
          var i = 0;
            data.forEach( function(accident) {
              i++;
              if (accident.latitude&& accident.longitude) {
                
                accidents.push( new google.maps.LatLng(accident.latitude, accident.longitude) );
              };
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
    function setStations(){
      infoWindow = new google.maps.InfoWindow({ content: "Holding..."});
      $.getJSON( "data/stations.json", function( data ) {
            
            data.forEach( function(station) {
              var marker = new google.maps.Marker({
                map: map,
                draggable: true,
                position: new google.maps.LatLng(station.Latitude, station.Longitude) 
              });

              google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent(station["Station Name"]);
                infoWindow.open(map, this);
                if (isRoutingActive) {
                  route.push(station.Latitude + "," + station.Longitude);
                };
              });
              markers.push(marker);
            });
        });
    }

    function setSearchBox(){
      var origin = document.getElementById('origin');
      var destination = document.getElementById('destination');
      
      originBox = new google.maps.places.SearchBox(origin);
      destinationBox = new google.maps.places.SearchBox(destination);

      google.maps.event.addListener(originBox, 'places_changed', function() {
        var places = originBox.getPlaces();
        document.getElementById('originValue').value = places.geometry.location;
        
      });
      google.maps.event.addListener(destinationBox, 'places_changed', function() {
        var places = destinationBox.getPlaces();
        document.getElementById('destinationValue').value = places.geometry.location;
      });
      }

    function pickRoute(){

    }
    function calcRoute(origin, destination) {
      console.log("calcRoute");

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