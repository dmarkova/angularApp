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


capacityControllers.controller('ProjectsListController', ['$scope', 'projectsService','employeesService', '$filter', 'dateCalcService',
  function($scope, projectsService, employeesService, $filter, dateCalcService) {

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

capacityControllers.controller('EmployeesListController', ['$scope', 'projectsService', 'employeesService', 'dateCalcService',
  function($scope, projectsService, employeesService, dateCalcService) {
    
    $scope.projects = projectsService.projects();
    $scope.employees = employeesService.employees();

    $scope.dateRange = {
      startDate: "1 January",
      endDate: "31 December",
      year: "2015"
    };
   

    $scope.calendar = [];

    function createCalendar() {
      var startDate = new Date($scope.dateRange.year + ' ' +  $scope.dateRange.startDate),
          endDate = new Date($scope.dateRange.year + ' ' +  $scope.dateRange.endDate),
          nextDate = new Date(startDate);

      // date = dateCalcService.createTimestamp(startDate);
      // endDate = dateCalcService.createTimestamp(endDate);
        
      while (nextDate <= endDate) {
        $scope.calendar.push(dateCalcService.createTimestamp(nextDate));
        nextDate.setDate(nextDate.getDate()+1);
      }
    };
    createCalendar();

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
  function($scope, $http, projectsService, datepickerService, dateCalcService) {
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

capacityControllers.controller('PrivateCapacityAddController', ['$scope',  '$http', 'employeesService', '$filter', 'datepickerService',
  function($scope, $http, employeesService, $filter, datepickerService) {
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

    $scope.capEmployee = {};
    $scope.capEmployee.vacations = [
      { 
        start: "",
        end: ""
      }
    ];
    $scope.capEmployee.dayoffs = [
      { 
        date: ""
      }
    ];


    function initialLoadVacation() {
      $scope.capEmployee.vacations = [
        { 
          start: "",
          end: ""
        }
      ];
    };
    function initialLoadDayoff() {
      $scope.capEmployee.dayoffs = [
        { 
          date: ""
        }
      ];
    };
    initialLoadVacation(0);
    initialLoadDayoff(0);

    // $scope.capProject.capacity[0].start = $scope.project.start;
    // $scope.capProject.capacity[0].end = $scope.project.end;

    $scope.addVacation = function() {
      $scope.capEmployee.vacations.push({
        start: "",
        end: ""
      });
    };
    $scope.addDayoff = function() {
      $scope.capEmployee.dayoffs.push({ 
        date: ""
      });
    };

    $scope.removeCapacity = function(index) {
      $scope.capEmployee.capacity.splice(index, 1);
    };

    $scope.savePrivateCapacity = function() {
      var employeeSelected = $filter('getById')($scope.employees, $scope.capEmployee.employee);

      angular.forEach($scope.capEmployee.vacations, function(item) {

        item.start = Math.floor(item.start.getTime());
        item.end = Math.floor(item.end.getTime());

        employeesService.addPrivateCapacity(employeeSelected, "vacations", item);

        employeesService.addPrivateCapacity(employeeSelected, "dayoffs", item);

        // projectSelected.employees[employeeID].capacity.push(item);
      });

      $scope.capProject = {};
      initialLoadVacation();
      initialLoadDayoff();

      // Set back to pristine.
      $scope.forms.privateCapacityForm.$setPristine();
      // Since Angular 1.3, set back to untouched state.
      $scope.forms.privateCapacityForm.$setUntouched();

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

