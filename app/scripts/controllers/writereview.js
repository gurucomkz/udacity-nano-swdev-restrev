'use strict';

/**
 * @ngdoc function
 * @name restRevApp.controller:WritereviewCtrl
 * @description
 * # WritereviewCtrl
 * Controller of the restRevApp
 */
angular.module('restRevApp')
.controller('WritereviewCtrl', [
    '$scope',
    '$routeParams',
function ($scope, $routeParams) {
    $scope.restaurant = {
        id: $routeParams.restaurantId,
        name: $routeParams.restaurantName
    };
}]);
