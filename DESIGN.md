
Overview
This project is meant to be a model to demonstrate the principles behind the SmartFlow traffic simulation.  As such, it is implemented as a web application with a simple UI, so that it can be widely shared and easily used.

The heart of the application is implemented in Javascript.  This has a number of important benefits for this project.  For one, it allows easy implementation of interactivity and user inputs.  This also allows the program to run client-side, which greatly improves performance as the simulation gets complex.  Notably, the main function initMap() is asynchronous, and many functions make use of callback functions or promises to make sure that code is executed in the correct order.

Vehicle Class
The project defines the core class of the simulation, the vehicle.  Since the intended application is car traffic, the default travel mode is driving, though this could be updated for other types of analysis.  The vehicle is implemented as a class, so that each visible object in the map is associated with numerous unique attribute that are important to how the vehicles work.

The class constructor in this implementation populates all necessary properties and sets the vehicle in motion.  The constructor calls the generatePoint() function, which generates a random Latlng object within the map bounds for both the vehicle origin and destination (https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng).  The getRoute() method is then called, which puts in a request to the Directions service, and then pulls an encoded route polyline from the response.  This is done by putting subsequent functions in a callback function for the request.

Next, the setSymbol() function generates a polyline marker to add to the map, and adds the line as an object to the route array (more on that next).

The animateCircle() function puts a vehicle marker in motion along the route.  The vehicle marker progresses as it's offset property is updated as a function of the duration of the route in seconds and the length of the route, with the time multiplier factored into the progression speed.  Once progression hits 100%, the route is removed from the map, and the remove() function is called.  This removes the specified route from the route array, and the vehicle from the array of Vehicle objects.

The run_sim() function runs the overall simulation upon a click of the Start button.  It manages the use of user input values, and the number of vehicles in the simulation at a time.

Vehicle and Route Arrays
The Vehicle and route arrays keep track of running vehicle objects and routes.  This is important because it is how the application manages the flow of the simulation.  When a vehicle reaches its destination, it is removed from the Vehicle array.  An event listener notices that not enough vehicles are in the application, and generates a new vehicle.  The route array is important because it manages the routes as separate objects in the map.  This is done so that routes can be persisted if desired for further analysis, and so that routes can be managed independently once vehicles are removed.  In this implementation, the routes are cleared from the map and route array when the vehicle reaches its destination.

