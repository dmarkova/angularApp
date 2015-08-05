'use strict';

/* Controllers */

var capacityControllers = angular.module('capacityControllers', ['ui.bootstrap', 'ui.multiselect']);


capacityControllers.controller('TabsController', ['$rootScope','$scope', '$state', 
  function($rootScope,$scope,$state) {
    $scope.tabs = [
      { 
        heading: "Projects", 
        route:"main.projects",
        active:false
      },
      { 
        heading: "Employees", 
        route:"main.employees",
        active:false
      }
    ]; 
    
    $scope.go = function(route){
        $state.go(route);
    };

    $scope.active = function(route){
        return $state.is(route);
    };

    $scope.$on("$stateChangeSuccess", function() {
        $scope.tabs.forEach(function(tab) {
            tab.active = $scope.active(tab.route);
        });
    });
  }
]);


capacityControllers.controller('ProjectsListController', ['$scope', '$http', 'projectsService', 'calendarService', 'employeesService',
  function($scope, $http, projectsService, calendarService, employeesService) {
    $scope.projects = projectsService.query();
    $scope.calendar = calendarService.query();
    $scope.employees = employeesService.query();

    $scope.getShortfall = function(capacity, projects){
      var totalHours = 0,
          result = 0;
      angular.forEach(projects,function(value, key) {
          if (value) {
            totalHours += parseFloat(value);
          }
      });
      result = capacity - totalHours;
      result = parseFloat(result.toPrecision(12));
      return result;
    };

    //Toolbar controller
    // $scope.project = {};
    $scope.project = new projectsService();
    $scope.datePicker = {};

    $scope.today = function() {
      $scope.projectStart = new Date();
      $scope.projectEnd = new Date();
    };
    $scope.today();

    $scope.format = 'dd MMMM yyyy';

    $scope.startOptions = {
      startingDay: 1
    };

    $scope.endOptions = {
      startingDay: 1
    };

    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.datePicker[opened] = true;
    };

 
    $scope.addProject = function() {
      $scope.project.start = Math.floor($scope.project.start.getTime());
      $scope.project.end = Math.floor($scope.project.end.getTime());
      $scope.projects.push($scope.project);
      $scope.project = new projectsService();

      //POST to server
      // $scope.project.$save();
    };
    
    $scope.capacities = [
      { 
        capacity: "",
        start: "",
        end: ""
      }
    ];
    $scope.addCapacity = function() {
      $scope.capacities.push({ 
        capacity: "",
        start: "",
        end: ""
      });
    };


  }]);

capacityControllers.controller('ProjectInfoController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get('projects/' + $routeParams.projectId + '.json').success(function(data) {
      $scope.project = data;
    });
  }]);

capacityControllers.controller('EmployeesListController', ['$scope', '$http',
  function($scope, $http) {
    $http.get('projects/dayCalendar.json').success(function(data) {
      $scope.calendar = data;
    });
    $http.get('projects/projects.json').success(function(data) {
      $scope.projects = data;
    });
    $http.get('projects/employees.json').success(function(data) {
      $scope.employees = data;
    });

    $scope.getTotal = function(employee) {
      var totalHours = 0,
          result = 0;
      angular.forEach(employee.projects,function(value, key) {
        if (value) {
          totalHours += parseFloat(value);
        }
      });
      if (employee.dayOff) {
        totalHours += parseFloat(employee.dayOff);
      }
      result = 1 - totalHours;
      result = parseFloat(result.toPrecision(12));
      return result;
    }
  }]);

capacityControllers.controller('ToolbarController', ['$scope',  '$http', 'projectsService', 'employeesService',
  function($scope, $http, projectsService, employeesService) {
    
    // $scope.project = {};
    $scope.project = new projectsService();

    $scope.projects = projectsService.query();
    $scope.employees = employeesService.query();

    // employeesService.list(function(employees) {
    //   $scope.employees = employees;
    // });

    $scope.today = function() {
      $scope.projectStart = new Date();
      $scope.projectEnd = new Date();
    };
    $scope.today();

    $scope.format = 'dd MMMM yyyy';

    $scope.startOptions = {
      startingDay: 1
    };

    $scope.endOptions = {
      startingDay: 1
    };

    $scope.openStart = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedStart = true;
    };

    $scope.openEnd = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedEnd = true;
    };
 
    $scope.addProject = function() {
      $scope.project.$save();
      $scope.project = new projectsService();
    };
    
    $scope.addEmployee = function() {
      
    };

}]);
