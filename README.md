This Recipe Finder application is based on node.js. It provides CLI command to load Recipes and Fridge data from files and output the found best match recipe.

## Getting Started

In the root folder of the project, run:
```
% node run.js data/recipes.json data/fridge.csv 
```


## Run test case
In root folder, run:
```
% nodeunit test
```

## Run automated grunt tasks, such as jshint and nodeunit test
In root folder, run:
```
% grunt
```


# Installation
You need to install node.js to run the application, and nodeunit to run the test. If you want
to run the automated tasks, you need to install grunt.


#Impementation and design highlights

* The main logic of Recipe Finder is encapsulated into the module: lib/RecipeFinder.js. This ensures that most of the functions are testable and easy to re-use and maintain.

* The implementation tries to use as less global variables as prossible, so the code are more decoupled and cleaner.

* The asyncronous way of loading files will make the program faster and more scalable for future extensions.

* To manage the asyncronous functions and to avoid callback hell, the progrem uses async.js module to manage the workflow of parallel execution of I/O calls.

* The underscore.js module provides many nice and handy functional programming utilities, which make the code succint.

* The configured Grunt.js automates common tasks such as jshint, unit test and watch live code, which streamlines the development process.


## License
Copyright (c) 2014 Yusong Yue  
Licensed under the MIT license.
