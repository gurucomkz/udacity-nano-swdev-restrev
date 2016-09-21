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
    '$timeout',
    '$mdToast',
function ($scope, $routeParams, $timeout, $mdToast) {
    $scope.sending = false;
    $scope.author = {
        email: '',
        name: ''
    };
    $scope.review = {
        stars: 3,
        text: ''
    };
    $scope.restaurant = {
        id: $routeParams.restaurantId,
        name: $routeParams.restaurantName
    };

    $scope.saveReview = function(){
        $scope.sending = true;
        $mdToast.showSimple('Review is being sent...');

        $timeout(function() {
            $mdToast.showSimple('Review sent. Thank you.');
            $scope.sending = false;
            window.location = '#/';
        }, 3000);
    };
}]);
