/**
 * @ngdoc function
 * @name restRevApp.controller:RestaurantCtrl
 * @description
 * # RestaurantCtrl
 * Controller of the restRevApp
 */
angular.module('restRevApp')
.controller('RestaurantCtrl', [
    '$scope',
    'RestData',
    '$routeParams',
function ($scope, RestData, $routeParams) {
    'use strict';

    $scope.restaurant = null;

    RestData.getRestaurant($routeParams.restaurantId)
    .then(function(data) {
        $scope.restaurant = data.restaurant;
        $scope.reviews = data.reviews;
        $scope.$apply();
    });

}]);
