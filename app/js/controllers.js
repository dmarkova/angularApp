'use strict';

/* Controllers */

var capacityControllers = angular.module('capacityControllers', ['ui.bootstrap']);

capacityControllers.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

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
    $scope.calendar = dateCalcService.getWeekCalendar(2015);

    $scope.projects = projectsService.projects();
    $scope.employees = employeesService.employees();
    // $scope.projects = projectsService.query();
    // $scope.employees = employeesService.query(function(){
    //    $scope.employeeNumber = $scope.employees.length;
    //    alert($scope.employeeNumber);
    // });
    $scope.employeeNumber = $scope.employees.length;

    $scope.forms = {};
    $scope.numberMonths = 12;

    $scope.year = 2015;

    $scope.actual = true;
    $scope.expandTable = function() {
        $scope.actual = !$scope.actual;
    };

    $scope.$watch('actual', function(){
      $scope.expandBtnText = $scope.actual ? 'Show full year!' : 'Hide full year';
    })

    $scope.getMonth = dateCalcService.getMonth;
    
    $scope.getNumber = function(num) {
        return new Array(num);   
    };

    $scope.getMonthLength = function(month, calendar, actual) {
      return dateCalcService.weeksInMonth(month, calendar, actual);
    };
    $scope.checkActualMonth = function(month) {
      return dateCalcService.checkActualMonth(month);
    };
    $scope.checkActualWeek = function(week) {
      return dateCalcService.checkActualWeek(week);
    };

    $scope.getShortfall = function(week){
      var totalHours = 0,
          result = 0;

      angular.forEach($scope.projects,function(project) {
          totalHours += $scope.getCapacity(project, week);
      });

      result = $scope.employeeNumber - totalHours;
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

capacityControllers.controller('ProjectController', ['$scope', '$stateParams', 'projectsService', 'employeesService', '$filter',
  function($scope, $stateParams, projectsService, employeesService, $filter) {
    $scope.projects = projectsService.projects();
    $scope.employees = employeesService.employees();
    $scope.project = $filter('getById')($scope.projects, $stateParams.projectId);
    $scope.activeEmployees = [];

    angular.forEach($scope.project.employees,function(value, key) {
      var employee = _.find($scope.employees, function(employee){ 
        return employee.id == key; 
      });
      $scope.activeEmployees.push(employee);
    });
}]);

capacityControllers.controller('EmployeeController', ['$scope', '$stateParams', 'projectsService', 'employeesService', '$filter',
  function($scope, $stateParams, projectsService, employeesService, $filter) {
    $scope.employees = employeesService.employees();
    $scope.employee = $filter('getById')($scope.employees, $stateParams.employeeId);
    $scope.projects = projectsService.projects();


    $scope.activeProjects = _.filter($scope.projects, function(project){ 
      return project.employees[$scope.employee.id]; 
    });
}]);

capacityControllers.controller('ProjectEditController', ['$scope', '$stateParams', 'projectsService', 'employeesService', '$filter',
  function($scope, $stateParams, projectsService, employeesService, $filter) {
    $scope.employeeCapacity = function(project, employee) {
      var capacity = project.employees[employee.id].capacity;
      return capacity;
    };
}]);

capacityControllers.controller('EmployeeEditController', ['$scope', '$stateParams', 'projectsService', 'employeesService', '$filter',
  function($scope, $stateParams, projectsService, employeesService, $filter) {
    $scope.projectCapacity = function(project, employee) {
      var capacity = project.employees[employee.id].capacity;
      return capacity;
    };
}]);



capacityControllers.controller('EmployeesListController', ['$scope', 'projectsService', 'employeesService', 'dateCalcService', '_', '$filter',
  function($scope, projectsService, employeesService, dateCalcService, _, $filter) {
    
    $scope.projects = projectsService.projects();
    $scope.employees = employeesService.employees();

    $scope.calendar = dateCalcService.getCalendar(2015);
    $scope.numberMonths = 12;

    $scope.year = 2015;
    
    $scope.actual = true;

    $scope.getMonthLength = function(month, year, actual) {
      return dateCalcService.daysInMonth(month, year, actual);
    };    

    $scope.checkActualDay = function(day) {
      return dateCalcService.checkActualDay(day);
    };
    $scope.checkActualMonth = function(month) {
      return dateCalcService.checkActualMonth(month);
    };
    $scope.getNumber = function(num) {
        return new Array(num);   
    };
    
    $scope.expandTable = function() {
        $scope.actual = !$scope.actual;
    };

    $scope.$watch('actual', function(){
      $scope.expandBtnText = $scope.actual ? 'Show full year!' : 'Hide full year';
    })

    $scope.getTotal = function(employee, day) {
      var totalHours = 0,
          result = 0;

      angular.forEach($scope.employeeProjects(employee),function(project) {
        totalHours += $scope.getDayCapacity(project,employee,day);
      });

      totalHours += $scope.getDayOff(employee, day);

      result = 1 - totalHours;
      result = parseFloat(result.toPrecision(12));
      return result;
    };

    $scope.employeeProjects = function(employee) {
      return _.filter($scope.projects, function(project){ 
        return project.employees[employee.id]; 
      });
    };

    $scope.checkDayRange = function(capacity, day){
      return (day >= capacity.start) && (day <= capacity.end);
    };
    $scope.checkDay = function(capacity, day){
      return day == capacity.date;
    };

    $scope.getDayCapacity = function(project, employee, day){
      var total = 0;

      angular.forEach(project.employees[employee.id].capacity,function(item) {
       if ($scope.checkDayRange(item, day.date)) {
          total += item.value;
        };
      });
      return total;
    };
    $scope.getDayOff = function(employee, day){
      var total = 0;

      angular.forEach(employee.vacations,function(item) {
       if ($scope.checkDayRange(item, day.date)) {
          total = 1;
        };
      });
      angular.forEach(employee.dayoffs,function(item) {
       if ($scope.checkDay(item, day.date)) {
          total = 1;
        };
      });
      
      return total;
    };

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
      $scope.project.id = $scope.project.name.replace(/\s+/g, '-').toLowerCase();

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
      $scope.employee.id = $scope.employee.name.replace(/\s+/g, '').toLowerCase();

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

        // projectSelected.employees[employeeID].capacity.push(item);
      });

      angular.forEach($scope.capEmployee.dayoffs, function(item) {

        item.date = Math.floor(item.date.getTime());
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

