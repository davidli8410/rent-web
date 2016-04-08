'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatAnimations',

  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices'
]);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/phones', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl'
      }).
      when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
      when('/home/', {
        templateUrl: 'partials/home.html',
        controller:'HomeCtrl'
      }).
      when('/register/', {
        templateUrl: 'partials/register.html',
      }).
      when('/login/', {
        templateUrl: 'partials/login.html',
      }).
      when('/signin/', {
        templateUrl: 'partials/signin.html',
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
