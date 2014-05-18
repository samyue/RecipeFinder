//Application modules
var recipeFinder = require('./lib/RecipeFinder');

if (process.argv.length < 4) {
    console.log('Usage: node ' + process.argv[1] + ' Recipes-JSON-File Fridge-CSV-File-Name');
    process.exit(1);
}
    

var recipesFilePath = process.argv[2];
var fridgeFilePath = process.argv[3];

var result = recipeFinder.run(recipesFilePath, fridgeFilePath);
if (result) {
    console.log('Found recipe:' ,util.inspect(result.recipe, {showHidden: true, depth: null})); 
} else {
    console.log('Order Takeout');
    
}
