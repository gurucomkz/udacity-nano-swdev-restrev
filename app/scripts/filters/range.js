'use strict';

/**
 * @ngdoc filter
 * @name restRevApp.filter:range
 * @function
 * @description
 * # range
 * Filter in the restRevApp.
 */
angular.module('restRevApp')
.filter('range', function () {
    return function (input) {
        if(typeof input !== 'number') {
            return input;
        }
        return new Array(input);
    };
});
