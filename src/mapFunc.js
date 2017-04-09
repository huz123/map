var map = null;
var gmap = null;
function initMap() {
  map  = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.8, lng: -77.85},
    zoom: 14
  });
  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var iconBase = 'https://maps.google.com/mapfiles/kml/paddle/';
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

    var markerProp = {
          position: {lat: position.coords.latitude, lng: position.coords.longitude},
          map: map,
          icon: iconBase + 'red-circle-lv.png',
	  animation: google.maps.Animation.DROP
    };
    var marker = new google.maps.Marker(markerProp);

      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here.');
      map.setCenter(pos);
     gmap = map;
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

/*
function initMap() {
  // initialize the map
  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    var myCenter = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    var mapProp = {
      center: myCenter,
      zoom:15,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
    var marker = new google.maps.Marker({position:myCenter});
    marker.setMap(map);
  }

  getLocation();
}

*/
function multMap() {
  // multipersons in one map
  var map = new google.maps.Map(document.getElementById('googleMap'), {
    zoom: 14,
    center: {lat: 40.8, lng: -77.8600012},
    });
  var myLoc = getLocation();
  var people = [
    //['Me', 40.801, -77.854, 1, true],
    myLoc,
    ['Sam', 40.8, -77.849, 2, false],
    ['Cindy', 40.805, -77.8495, 3, false]
  ];
//  document.getElementById("demo").innerHTML = people[0][2];
  setMarkers(map, people);
}

function getLocation(){
  // get the current location from device
  var lat = Number(document.getElementById("position").elements[0].value);
  var lon = Number(document.getElementById("position").elements[1].value);
  var me = ['Me', lat, lon, 1, true];
  return me;
}


function setMarkers(map,people) {
  // get the markers of people from the html form
  for (var i = 0; i < people.length; i++) {
    var person = people[i];
    var iconBase = 'https://maps.google.com/mapfiles/kml/paddle/';
    var markerProp = {
      position: {lat: person[1], lng: person[2]},
      map: map,
      title: person[0],
      zIndex: person[3]
    };
    if (person[4]){
      markerProp.icon = iconBase + 'ylw-stars.png';
    }
 
    var marker = new google.maps.Marker(markerProp);
  }
}

