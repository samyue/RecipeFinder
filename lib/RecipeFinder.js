/*
 * RecipeFinder
 * https://github.com/samyue/RecipeFinder
 *
 * Copyright (c) 2014 Yusong Yue
 * Licensed under the MIT license.
 */

'use strict';

//Third party modules
var _ = require('underscore');
var csv = require('csv');
var _ = require('underscore');
var async = require('async');
var jf = require('jsonfile');
var moment = require('moment');

//Constants
var DATE_FORMAT = 'DD-MM-YYYY';


//The module to be exported
var recipeFinder = module.exports = {};


/**
 * This function is the starting point of the module
 * @param {string} recipeFilePath This is the file path to the recipe data
 * @param {string} fridgeFilePath This is the file path to the fridge data
 * @param {function} callback This callback is used to return the found results.
 * It has two arguments: @error and @data.
 */
recipeFinder.run= function (recipeFilePath, fridgeFilePath, callback) {

    var recipeData;
    var fridgeData;


    //The file data can be loaded asyncronously in parallel, which provides good
    //performanc for future needs.
    //Once both the files are loaded, we can start the finding algorithm.
    async.parallel([
        //load fridge CSV file
        function(callback) {
            recipeFinder.readJson(recipeFilePath, function(err, data){

                if (err) {
                    callback(err);
                    return;
                }

                recipeData = data;
                //console.log('recipeData: ', recipeData);
                callback();
            });
        },
        //load recipes JSON file
        function(callback) {
            recipeFinder.readCsv(fridgeFilePath, function(err, data) {
                if (err) {
                    callback(err);
                    return;
                }
                fridgeData = data;
                //console.log('fridgeData: ', fridgeData);
                callback();
            });
        }

    ], function(err){
        if (err) {
            callback(err);
        }

        var result = recipeFinder.findRecipe(recipeData, fridgeData);

        //Found result is passed to the callback function.
        callback(err, result);
        
    });
  
};

/**
 * readJson is used to load the recipe data. However, this function is generalized,
 * so that it can be re-used for loading other JSON data.
 */
recipeFinder.readJson = function (fileName, callback) {
    jf.readFile(fileName, function(err, obj) {
        callback(err, obj);
    });
};

/**
 * readCsv is used to load the fridge data. However, this function is generalized,
 * so that it can be re-used for loading other CSV data.
 */
recipeFinder.readCsv = function (fileName, callback) {

    csv()
    .from.path(fileName, {delimiter: ',', escape: '"'})
    .to.array(function(data){
        callback(null, data);
    })
    .on('error', function(error) {
        callback(error);
    });
};
/**
 * Find recipe that has all the required unexpired ingredients in the fridge 
 * and has the oldest used by time.
 * @return {success: boolean, recipe: Object, matchedIngredientList: Array}
 */
recipeFinder.findRecipe = function (recipes, fridgeItems) {
    var foundRecipeResults = [];
    _.each(recipes, function(recipe) {
        var result = recipeFinder.checkRecipe(recipe, fridgeItems);
        if (result.success) {
            foundRecipeResults.push(result);
        }

    });

    if (foundRecipeResults.length === 1) {
        return foundRecipeResults[0];
    } else if (foundRecipeResults.length > 1) {
        var recipe = recipeFinder.findRecipeWithClosestUsedByItem(foundRecipeResults);
        return recipe;
    } else {
        return false;
    }
};
/**
 * If multiple valid recipes have been found, this function is used
 * to find out the recipe that has oldest used-by date.
 */
recipeFinder.findRecipeWithClosestUsedByItem = function (recipeResults) {
    return _.min(recipeResults, function(result){
        var oldestIngredient =  _.min(result.matchedIngredientList, function(ingredient) {
            var expirationTime = moment(ingredient[3], DATE_FORMAT);
            return expirationTime.unix();
        });
        return moment(oldestIngredient[3], DATE_FORMAT).unix();
    });
};
/**
 * This function will check whether the given recipe has all the reqired unexpired ingredients in fridge.
 * @return {success: boolean, matchedIngredientList: Array, recipe: Object}
 */
recipeFinder.checkRecipe = function (recipe, fridgeItems) {
    var matchedIngredientList = [];
    var result = {};

    _.each(recipe.ingredients, function(ingredient) {
        var foundItem = recipeFinder.findRequiredIngreidnet(ingredient, fridgeItems);
        if (foundItem) {
            matchedIngredientList.push(foundItem);
        }
    });

    if (matchedIngredientList.length === recipe.ingredients.length) {
        result.success = true;
        result.matchedIngredientList = matchedIngredientList;
        result.recipe = recipe;
    } else {
        result.success = false;
    }

     return result;

};
/**
 * Found oldest unexpired item in fridge that matches the reqired ingredient.
 * @return true if found all required unexpired items in fridge; false otherwise.
 */
recipeFinder.findRequiredIngreidnet = function (requiredItem, fridgeItems) {
    
    var requiredAmount = parseInt(requiredItem.amount, 10);

    // Sort fridge items by expiration time, so the grogram can
    // find the oldest unexpired item first. This will be more efficient
    // than the algorithm that find all the matched items in the whole list first then find
    // the oldest unexpired item in all matched items.
    var sortedFridgeItems = _.sortBy(fridgeItems, function(item) {
        var expirationTime = moment(item[3], DATE_FORMAT);
        return expirationTime.unix();
    });

    var item = _.find(sortedFridgeItems, function(item) {
        var now = moment();
        var expirationTime = moment(item[3], DATE_FORMAT);
        if (expirationTime.isBefore(now)) {
            return false;
        }

        var name = item[0];
        var amount = parseInt(item[1], 10);
        var unit = item[2];

        return requiredItem.item === name && requiredAmount <= amount && requiredItem.unit === unit;
    });

    return item;
};

