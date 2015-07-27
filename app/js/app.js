'use strict';

/* App Module */

var capacityApp = angular.module('capacityApp', ["ui.router", "ui.bootstrap","capacityControllers"]);

capacityApp.config(function($stateProvider, $urlRouterProvider) {
     $urlRouterProvider.otherwise("/main/projects");

     $stateProvider
      .state("main", { 
        abstract: true, 
        url:"/main", 
        templateUrl:"partials/main.html" 
      })
        .state("main.projects", { 
          url: '/projects', 
          templateUrl: 'partials/projects-list.html',
          controller: 'ProjectsListController'
        })
        .state("main.employees", { 
          url: '/employees', 
          templateUrl: 'partials/employees-list.html',
          controller: 'EmployeesListController'
        })

      // when('/projects', {
      //   templateUrl: 'partials/projects-list.html',
      //   controller: 'ProjectsListController'
      // }).
      // when('/projects/:projectId', {
      //   templateUrl: 'partials/project-info.html',
      //   controller: 'ProjectInfoController'
      // }).
      // when('/employees', {
      //   templateUrl: 'partials/employees-list.html',
      //   controller: 'employeesListCtrl'
      // }).
      // when('/employees/:employeeId', {
      //   templateUrl: 'partials/employee-info.html',
      //   controller: 'employeeInfoCtrl'
      // }).
      // otherwise({
      //   redirectTo: '/projects'
      // });
  });
