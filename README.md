
Video presentation link:
https://youtu.be/K8qMqR_HrYg

Intro
This project provides the framework for a traffic simulation program that can be extended to analyze real-world questions.  This implementation is presented in a web application format to easily demonstrate and share the principles behind the program.
The program uses the Google Maps Directions and Map APIs to display the map window and to perform the vehicle routing.  The application was created with Flask in a Python backend.  The website uses Bootstrap to extend aspects of html/css design.

Setup
1. Add the SmartFlow.zip file to VSCode
2. Unzip the file using "unzip SmartFlow.zip" in the terminal
3. Navigate to program directory with "cd SmartFlow"
4. Run the program with "flask run"
5. The program uses an API key that is capped at 5000 requests per day, which should be sufficient for testing.  However, if more than this number of requests need to be made, a new API key can be generated using the following steps:
https://developers.google.com/maps/documentation/javascript/cloud-setup
Once a new API key is generated, it can be inserted on line 22 of "SmartFlow/templates/map.html"

Usage
1. Once the Flask application is running, you can navigate to the website splash page.  This provides some background on the project.
2. To Use the simulation, use the navigation links at the top-left of the page to open the "Simulation" page.
3. Once there, scroll down and use sliders to set the parameters of the simulation.  In this implementation, you can set the Time Multiplier, which speeds up the simulation, and the Vehicle Multiplier, which controls the number of simulated routes and vehicles navigating the map at a given time.
4. Click the "Start" button to run the simulation.

FAQ
Where can the simulation be run?
The simulation can be run anywhere that Google has coverage of street directions.  Note that routes will be most consistently dispayed in urban areas with high street coverage, as this is the intended use case for the simulation.

How are origins and destinations generated?
In this implementation, origins and destinations are generated at random.  Each vehicle has a latitude-longitude origin and destination generated at random within the bounding box of the current map display.

Why do some vehicles move faster than others?
The vehicles in this implementation are traveling at a speed interpolated from the estimated total travel time of the route using the "Driving" travel mode.  This travel time is divided by the length of the route to get the position of the vehicle.

Future updates
Vehicle interactions
This is the first step in future development.  Vehicles need to be able to interact with the environment around them.  For example, they could query the speed limit of the road where they are located at any given time, and travel at the speed limit for that road.  They could detect stop lights and stop signs.  And most importantly, they could detect each other, which is essential to actually modelling traffic.

Statistics
Future implementations should log statistics to the database that could be used to draw conclusions from the simulation.  For example, keeping track of actual vs predicted time to destination could give us insights on the effects of traffic.  Frequency of vehicles crossing a given point could have urban planning implications.

Immigration to & Emigration from Bounding area
The current model only accounts for trips that begin and end within the starting area, when in reality many vehicles might begin and/or end their journeys outside the area.  Users should be able to specify a percentage likelihood that vehicles are entering the area, as well as leaving.  This is important for applications like rush-hour analysis in city centers, when most cars are entering in the morning and leaving in the evening.  It could be accomplished by generating start or end points at the edges of the bounding box rather than within it.