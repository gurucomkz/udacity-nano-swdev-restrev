/**
 * @ngdoc function
 * @name restRevApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the restRevApp
 */
angular.module('restRevApp')
.controller('MainCtrl', [
    '$scope',
    'RestData',
function ($scope, RestData) {
    'use strict';
    var main = this;

    RestData.getRestaurants()
    .then(function(data) {
        main.restaurants = data;
        $scope.$apply();
    });

}]);
