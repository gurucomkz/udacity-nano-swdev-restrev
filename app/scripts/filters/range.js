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
        if(typeof input !== 'number' && typeof input !== 'string') {
            return input;
        }
        input = parseInt(input);
        var ret = [];
        for(var i=0; i<input; i++){ ret.push(i); }
        return ret;
    };
});
