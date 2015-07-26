'use strict';

/* Controllers */

var capacityControllers = angular.module('capacityControllers', []);


capacityControllers.controller('TabsController', ['$scope', '$http',
  function($scope, $http) {
    $scope.tabs = [
      { 
        link : '#/projects', 
        label : 'Projects' 
      },
      { link : '#/employees', 
        label : 'Employees' 
      }
    ]; 
    
  $scope.selectedTab = $scope.tabs[0];    
  $scope.setSelectedTab = function(tab) {
    $scope.selectedTab = tab;
  }
  
  $scope.tabClass = function(tab) {
    if ($scope.selectedTab == tab) {
      return "active";
    } else {
      return "";
    }
  }
}]);


capacityControllers.controller('ProjectsListController', ['$scope', '$http',
  function($scope, $http) {
    $http.get('projects/projects.json').success(function(data) {
      $scope.projects = data;
    });
    $http.get('projects/calendar.json').success(function(data) {
      $scope.calendar = data;
    });

    $scope.getTotal = function(item){
      var total = 0;
      angular.forEach(item,function(value, key) {
          total += parseFloat(value);
      });
      return total;
    };

  }]);

capacityControllers.controller('ProjectInfoController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get('projects/' + $routeParams.projectId + '.json').success(function(data) {
      $scope.project = data;
    });
  }]);
