/**
 * @ngdoc service
 * @name restRevApp.RestData
 * @description
 * # RestData
 * Service in the restRevApp.
 */
angular.module('restRevApp')
.service('RestData', [
    '$http',
function ($http) {
    'use strict';
    var serverBase = 'http://localhost:9001/api';

    this.getRestaurants = function() {
        return new Promise(function(resolve, reject) {
            $http.get(serverBase + '/restaurants')
            .then(function(response) {
                resolve(response.data);
            })
            .catch(reject);
        });
    };

    this.getRestaurant = function(id) {
        return new Promise(function(resolve, reject) {
            $http.get(serverBase + '/restaurant/'+id)
            .then(function(response) {
                resolve(response.data);
            })
            .catch(reject);
        });
    };
}]);
