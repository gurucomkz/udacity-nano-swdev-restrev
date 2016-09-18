/**
 * @ngdoc overview
 * @name restRevApp
 * @description
 * # restRevApp
 *
 * Main module of the application.
 */
angular
.module('restRevApp', [
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial'
])
.config(function ($routeProvider) {
    'use strict';

    $routeProvider
    .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
    })
    .otherwise({
        redirectTo: '/'
    });
});
