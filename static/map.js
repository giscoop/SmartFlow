
// Set user-defined variables:

// Watch for changes to sliders on the html page, and update variable with their values if they do change; \
// also, update the html with their values.
var TIME_MULTIPLIER = 10;
var time_select = document.getElementById("timeMultiplier");
time_select.addEventListener("change", () => {
  document.getElementById("time_slider_label").innerHTML = `Time Multiplier: ${time_select.value}x`;
  TIME_MULTIPLIER = time_select.value;
});

var ROUTE_COUNT = 1;
var route_select = document.getElementById("routeMultiplier");
route_select.addEventListener("change", () => {
  document.getElementById("route_slider_label").innerHTML = `Vehicle Multiplier: ${route_select.value}x`;
  ROUTE_COUNT = route_select.value;
});

var current_speed;// to be assigned at simulation run time
var bounds = '';//to be assigned at simulation run time

// Generate list to store routes and vehicles
var route_array = Array();
var vehicle_array = Array();

// Set ID counter
var id_counter = 0;

// The default location of Harvard: 42.3770° N, 71.1167° W
const position = { lat: 42.3770, lng: -71.1167 };

// Initialize and add the map
let map;

// Main function
async function initMap() {

  // Request needed google libraries
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerView } = await google.maps.importLibrary("marker");
  const {encoding} = await google.maps.importLibrary("geometry");
  const {LatLngBounds} = await google.maps.importLibrary("core")

  // The map, centered at Harvard
  map = new Map(document.getElementById("map"), {
    zoom: 14,
    center: position,
    mapId: "map_ID",
  });

  // Set directions renderer & service
  var directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map)
  var directionsService = new google.maps.DirectionsService();

  // Define vehicle class: id, polyline, duration; vehicle x, y, street segment
  class Vehicle {
    // define a constructor
    constructor() {
      this.id=count();
      // Generate origin and destination within bounds
      this.origin=generatePoint();
      this.destination=generatePoint();
      // Run the class method on  initialization
      this.getRoute(this.origin, this.destination, this.id);
      this.rte_line='';
      this.rte_summary='';
    }
    // methods
    getRoute(start, end, id) {
      // Routes using the Google Directions API
      var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
      };
      // Send the request with a callback function as a parameter
      directionsService.route(request, function(result, status, id) {
        if (status == 'OK') {
          // Get estimated duration of the route
          var rte_duration = result.routes[0].legs[0].duration.value;
          // Other implementation options:
          //directionsRenderer.setDirections(result);
          //this.rte_summary = result.routes[0].summary;
          // Get the polyline and decode it
          var encoded = result.routes[0]["overview_polyline"];
          var decoded = getPolyline(encoded);
          setSymbol(decoded, rte_duration, id);
        };
      });
    };
  }


  // Iterate ID counter function
  function count() {
    id_counter += 1;
    return id_counter;
  }

  // Get polyline function
  function getPolyline(route_result) {
    var poly = encoding.decodePath(route_result);
    return poly;
  };

  // Generate polyline from route request
  function setSymbol(polyline, duration, id) {
    // Create a Polyline object, and assign it appropriate properties
    var line = new google.maps.Polyline({
      path: polyline,
      icons: [
        {
          icon: lineSymbol,
          offset: "0%",
        },
      ],
      strokeColor: "#FF0000",
      strokeOpacity: 0.5,
      strokeWeight: 5,
      map: map,
      vehicle_id: id_counter,
    });
    // Add line object to route_array
    route_array.push(line);
    // Pass line to animate fn
    animateCircle(line, duration, id);
  };

  // Function to generate moving marker
  function animateCircle(line, duration, id) {
    let count = 0;
    let progression = 0;
    // Set a refresh interval to execute
    var v_interval = window.setInterval(() => {
      // Iterate count, and update progression every 0.1 seconds, taking into account duration and time multiplier
      count = (count + 1);// % (duration * 10);//another option
      progression = (count * 10 * current_speed) / duration;
      const icons = line.get("icons");
      icons[0].offset = progression + "%";
      line.set("icons", icons);
      // Once the icon reaches the end of the line, remove it from the map and call remove fn; return out of animate function
      if (progression > 100) {
        line.setMap(null);
        remove(line.vehicle_id);
        return;
      }
    }, 100);
    return;
  };

  // Defines vehicle symbol
  const lineSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 6,
    strokeColor: "#000",
    strokeOpacity: "1.0",
  };

  // Generate points in bounding box
  function generatePoint() {
    // Get bounding box
    var xmax = Math.max(bounds.south, bounds.north);
    var xmin = Math.min(bounds.south, bounds.north);
    var x = Math.random() * (xmax - xmin) + xmin;
    var ymax = Math.max(bounds.west, bounds.east);
    var ymin = Math.min(bounds.west, bounds.east);
    var y = Math.random() * (ymax - ymin) + ymin;
    //console.log(x, y);
    return new google.maps.LatLng(x, y);
  };

  // Add bounds variable, and update it any time the map bounds change
  function assignBounds(in_map) {
    return in_map.getBounds().toJSON();
  };

  var current_bounds = '';
  google.maps.event.addListener(map, 'bounds_changed', function() {
    current_bounds = assignBounds(map);
  });

  // Function to clear vehicles and routes once they end
  function remove(id) {
    // remove from array
    vehicle_array = vehicle_array.filter(function(x) {
      return x.id != id;
    });
    route_array = route_array.filter(function(x) {
      return x.vehicle_id != id;
    });
  };

  // Call function to begin routing vehicles
  function run_sim() {
    // Lock sim conditions at time of run
    var vehicles = ROUTE_COUNT;
    current_speed = TIME_MULTIPLIER;
    bounds = current_bounds;
    setInterval(() => {
      if (vehicle_array.length < vehicles) {
        vehicle_array.push(new Vehicle());
      }
    }, 100);
  };

  // Listen for Start button press, and run the simulation
  const bsButton = new bootstrap.Button('#startButton');
  var buttonState = document.getElementById("startButton");
  var simulation;
  buttonState.addEventListener("click", function() {
    if (buttonState.innerHTML == 'Start') {
      buttonState.innerHTML = "Stop";
      simulation = run_sim();
    } else {
      buttonState.innerHTML = "Start";
      simulation = null;
    }
    bsButton.toggle()
  });

}

initMap();
