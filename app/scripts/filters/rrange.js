'use strict';

/**
 * @ngdoc filter
 * @name restRevApp.filter:rrange
 * @function
 * @description
 * # rrange
 * Filter in the restRevApp.
 */
angular.module('restRevApp')
.filter('rrange', function () {
    return function (input) {
        if(typeof input !== 'number' && typeof input !== 'string') {
            return input;
        }
        input = parseInt(input);
        var ret = [];
        for(var i = input-1; i>=0; i--){ ret.push(i); }
        return ret;
    };
});
