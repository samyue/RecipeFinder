This Recipe Finder application is based on node.js. It provides CLI command to load Recipes and Fridge data from files and output the found best match recipe.

## Getting Started

In the root folder of the project, run:
% node run.js data/recipes.json data/fridge.csv 


## Run test case
In root folder, run:
% nodeunit test


# Installation
You need to install node.js to run the application, and nodeunit to run the test.


#Impementation and design details
The main logic of Recipe Finder is encapsulated into module: lib/RecipeFinder.js. This ensures that most of the functions are testable and easier to re-use and maintain.


## License
Copyright (c) 2014 Yusong Yue  
Licensed under the MIT license.
