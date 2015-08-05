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


capacityControllers.controller('ProjectsListController', ['$scope', '$http',
  function($scope, $http) {
    $http.get('projects/projects.json').success(function(data) {
      $scope.projects = data;
    });
    $http.get('projects/calendar.json').success(function(data) {
      $scope.calendar = data;
    });

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

capacityControllers.controller('ToolbarController', ['$scope',  '$http',
  function($scope, $http) {

    $http.get('projects/employees.json').success(function(data) {
      $scope.employees = data;
    });
    $http.get('projects/projects.json').success(function(data) {
      $scope.projects = data;
    });

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
      $scope.projects.push({});
    };
    
    $scope.addEmployee = function() {
    
    };

}]);
