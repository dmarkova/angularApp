'use strict';

/* App Module */

var capacityApp = angular.module('capacityApp', [
  'ngRoute',
  'capacityControllers'
]);

capacityApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/projects', {
        templateUrl: 'partials/projects-list.html',
        controller: 'ProjectsListController'
      }).
      when('/projects/:projectId', {
        templateUrl: 'partials/project-info.html',
        controller: 'ProjectInfoController'
      }).
      when('/employees', {
        templateUrl: 'partials/employees-list.html',
        controller: 'employeesListCtrl'
      }).
      when('/employees/:employeeId', {
        templateUrl: 'partials/employee-info.html',
        controller: 'employeeInfoCtrl'
      }).
      otherwise({
        redirectTo: '/projects'
      });
  }]);
