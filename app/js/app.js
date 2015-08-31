'use strict';

/* App Module */

var capacityApp = angular.module('capacityApp', ["ui.router", "ui.bootstrap","capacityControllers", "capacityAppServices", "ngResource", "capacityAppFilters","capacityAppDirectives", "underscore"]);

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
        .state('main.project', {
          url: '/project/:projectId', 
          templateUrl: 'partials/project.html',
          controller: 'ProjectController'
        })
        .state('main.employee', {
          url: '/employee/:employeeId', 
          templateUrl: 'partials/employee.html',
          controller: 'EmployeeController'
        });

  });


