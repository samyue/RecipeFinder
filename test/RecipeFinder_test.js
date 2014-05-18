'use strict';

var RecipeFinder = require('../lib/RecipeFinder.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['awesome'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'testcase1': function(test) {
    test.expect(3);
    
    // tests here
    RecipeFinder.run('test-data/testcase1/recipes.json', 
      'test-data/testcase1/fridge.csv', 
      function(err, result) {
        test.equal(err, null, 'Should not have error.');
        test.ok(result, 'should have result');
        test.equal(result.recipe.name, "grilled cheese on toast");
        test.done();
    });
    
   
  },
  'testcase2': function(test) {
    test.expect(3);
    
    // tests here
    RecipeFinder.run('test-data/testcase2/recipes.json', 
      'test-data/testcase2/fridge.csv', 
      function(err, result) {
        test.equal(err, null, 'Should not have error.');
        test.ok(result, 'should have result');
        test.equal(result.recipe.name, "salad sandwich");
        test.done();
    });
  },
  'testcase3': function(test) {
    test.expect(3);
    
    // tests here
    RecipeFinder.run('test-data/testcase3/recipes.json', 
      'test-data/testcase3/fridge.csv', 
      function(err, result) {
        test.equal(err, null, 'Should not have error.');
        test.ok(result, 'should have result');
        test.equal(result.recipe.name, "grilled cheese on toast");
        test.done();
    });
  },
};
