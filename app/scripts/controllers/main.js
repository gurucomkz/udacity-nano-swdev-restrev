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
    '$mdToast',
function ($scope, RestData, $mdToast) {
    'use strict';
    var main = this;
    var originatorEv;
    var allData;
    $scope.starStats = {};

    RestData.getRestaurants()
    .then(function(data) {
        allData = data;

        var starStats = {};
        data.forEach(function(restaurant) { //gather stats
            var avg = restaurant.average;
            if(typeof starStats[avg] === 'undefined'){
                starStats[avg] = 0;
            }
            starStats[avg]++;
        });
        $scope.starStats = starStats;

        $scope.setFilter(0);
    });

    $scope.openFilterMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    $scope.setFilter = function(stars){
        stars = parseInt(stars);
        var data;
        if(!stars){
            data = allData;
            $mdToast.showSimple('Showing all restaurants');
        }else{
            data = allData.filter(function(restaurant) {
                return restaurant.average === stars;
            });

            $mdToast.showSimple('Showing '+stars+'-stars restaurants');
        }
        main.restaurants = data;
    };

}]);
