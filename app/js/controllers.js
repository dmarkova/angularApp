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


capacityControllers.controller('ProjectsListController', ['$scope', '$http', 'projectsService','employeesService', '$filter', 'dateCalcService',
  function($scope, $http, projectsService, employeesService, $filter, dateCalcService) {

    $scope.projects = projectsService.projects();
    $scope.employees = employeesService.employees();
    // $scope.projects = projectsService.query();
    // $scope.employees = employeesService.query(function(){
    //    $scope.employeeNumber = $scope.employees.length;
    //    alert($scope.employeeNumber);
    // });
    $scope.employeeNumber = $scope.employees.length;

    $scope.forms = {};

    $scope.date = {
      year: 2015,
      startDate: "1 January",
      endDate: "31 December"
    };

    $scope.getMonth = dateCalcService.getMonth;

    $scope.numberWeeks =  parseInt(dateCalcService.getWeek(new Date($scope.date.year + ' ' +  $scope.date.endDate)));

    $scope.getNumber = function(num) {
        return new Array(num);   
    };
    $scope.numberWeeksArray = $scope.getNumber($scope.numberWeeks);


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
    
    $scope.checkWeek = function(project, week){
      return (week >= dateCalcService.getWeek(project.start)) && (week <= dateCalcService.getWeek(project.end));
    };
    $scope.getCapacity = function(project, week){
      var total = 0;
      angular.forEach(project.employees,function(value, key) {
        angular.forEach(value.capacity,function(item) {
          if ($scope.checkWeek(item, week)) {
            total += item.value;
          }
        });
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

capacityControllers.controller('ProjectAddController', ['$scope',  '$http', 'projectsService', 'datepickerService', 'dateCalcService',
  function($scope, $http, projectsService, datepickerService,dateCalcService) {
    $scope.projects = projectsService.projects();

    $scope.project = {};
    // $scope.project = new projectsService()

    $scope.datepickerSettings = datepickerService;

    //for single datepicker entry
    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.datepickerSettings[opened] = true;
    };

    $scope.today = function() {
      $scope.project.start = new Date();
      $scope.project.end = new Date();
    };
    $scope.today();

    $scope.addProject = function() {
      $scope.project.start = dateCalcService.createTimestamp($scope.project.start);
      $scope.project.end = dateCalcService.createTimestamp($scope.project.end);
      $scope.project.id = dateCalcService.createTimestamp(new Date());

      projectsService.addProject($scope.project);
      // $scope.projects.push($scope.project);
      $scope.project = {};
      // $scope.project = new projectsService();

      //POST to server
      // $scope.project.$save();
    };

}]);

capacityControllers.controller('CapacityAddController', ['$scope',  '$http', 'projectsService', 'employeesService', '$filter', 'datepickerService',
  function($scope, $http, projectsService, employeesService, $filter, datepickerService) {
    $scope.projects = projectsService.projects();
    $scope.employees = employeesService.employees();

    $scope.datepickerSettings = datepickerService;

    //for datepicker entries inside ng-repeat
    $scope.openStart = function($event, dt) {
      $event.preventDefault();
      $event.stopPropagation();
      dt.openedStart = true;
    };
    $scope.openEnd = function($event, dt) {
      $event.preventDefault();
      $event.stopPropagation();
      dt.openedEnd = true;
    };

    $scope.capProject = {};
    $scope.capProject.capacity = [
      { 
        capacity: "",
        start: "",
        end: ""
      }
    ];

    function initialLoadCap() {
      $scope.capProject.capacity = [
        { 
          value: "",
          start: "",
          end: ""
        }
      ];
    };

    initialLoadCap(0);

    // $scope.capProject.capacity[0].start = $scope.project.start;
    // $scope.capProject.capacity[0].end = $scope.project.end;

    $scope.addCapacity = function() {
      $scope.capProject.capacity.push({ 
        value: "",
        start: "",
        end: ""
      });
    };

    $scope.removeCapacity = function(index) {
      $scope.capProject.capacity.splice(index, 1);
    };

    $scope.saveCapacity = function() {
      var projectSelected = $filter('getById')($scope.projects, $scope.capProject.id);
      var employeeID = $scope.capProject.employees;

      angular.forEach($scope.capProject.capacity, function(item) {

        item.start = Math.floor(item.start.getTime());
        item.end = Math.floor(item.end.getTime());
        item.value = parseFloat(item.value);

        

        projectsService.addCapacity($scope.capProject.id,employeeID,item);
        // projectSelected.employees[employeeID].capacity.push(item);
      });

      $scope.capProject = {};
      initialLoadCap();

      // Set back to pristine.
      $scope.forms.capacityForm.$setPristine();
      // Since Angular 1.3, set back to untouched state.
      $scope.forms.capacityForm.$setUntouched();

      // $scope.capProject.start = Math.floor($scope.capProject.start.getTime());
      // $scope.capProject.end = Math.floor($scope.capProject.end.getTime());
      // $scope.capProject.value = parseFloat($scope.capProject.value);
       // $scope.projects.
      // $scope.projects.push($scope.capProject);

  
      // $scope.projects.get({id:$scope.capProject.id}, function(project) {
      //   project.push($scope.capEmployee);
      //   project.$save();
      // });
      // $scope.project = new projectsService();

      //POST to server
      // $scope.project.$save();
    };


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

capacityControllers.controller('EmployeeAddController', ['$scope', 'employeesService','dateCalcService', 
  function($scope, employeesService,dateCalcService) {
    $scope.employees = employeesService.employees();

    $scope.employee = {};
    // $scope.project = new projectsService()

    $scope.addEmployee = function() {
      $scope.employee.id = dateCalcService.createTimestamp(new Date());

      employeesService.addEmployee($scope.employee);
      // $scope.projects.push($scope.project);
      $scope.employee = {};
      // $scope.project = new projectsService();

      //POST to server
      // $scope.project.$save();
    };

}]);
