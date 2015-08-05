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
        });

  });
