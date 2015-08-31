'use strict';

/* Directives */
angular.module('capacityAppDirectives', [])

.directive('editablerow', function() {
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      value: "=editablerow"
    },
    controller: function ($scope) {
        var oldValue = $scope.value;
        var changeEditStat = function (stat) {
            $scope.edit = stat;
            if (!stat && $scope.value !== oldValue) {
                console.log("Send request if you want to update on server.");
            }
        };
        $scope.editRow = function(){
            changeEditStat(true);
            // inputElement.focus();
        };
        $scope.cancelRow = function(){
            changeEditStat(false);
        };
    },
    templateUrl: "./partials/editableRowTemplate.html",
  };
})

.directive("editable", function () {
  return {
      scope: {
          value: "=editable",
          edit: "="
      },
      restrict: "A",
      templateUrl: "./partials/editableTemplate.html"
  };
})

.directive("editabledate",function () {
  return {
      scope: {
          value: "=editabledate",
          edit: "=",
          isOpen: "=",
          open: "&",
          item: "="
      },
      require: '^editablerow',
      restrict: "A",
      templateUrl: "./partials/editableDateTemplate.html",
      controller: function($scope) {    
    
        // //for datepicker entries inside ng-repeat
        // $scope.openStart = function($event, dt) {
        //   $event.preventDefault();
        //   $event.stopPropagation();
        //   dt.openedStart = true;
        // };
        // $scope.openEnd = function($event, dt) {
        //   $event.preventDefault();
        //   $event.stopPropagation();
        //   dt.openedEnd = true;
        // };
      }
  };
})
