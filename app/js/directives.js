'use strict';

/* Directives */
var templateDir = './partials/';
angular.module('capacityAppDirectives', [])

.directive('editablerow', ['$modal',function($modal) {

  var ModalInstanceCtrl = function($scope, $modalInstance) {
    $scope.ok = function() {
      $modalInstance.close();
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  };

  return {
    restrict: 'A',
    transclude: true,
    scope: {
      value: "=editablerow",
      array: "=editablearray"
    },   
    controller: function ($scope) {
       var changeEditStat = function (stat) {
            $scope.edit = stat;
        };
        $scope.editRow = function(){
            changeEditStat(true);
            $scope.oldValue = angular.copy($scope.value);
        };
        $scope.cancelRow = function(){
            changeEditStat(false);
            $scope.value = $scope.oldValue;
        };
        $scope.saveRow = function(){
            changeEditStat(false);
        };
        $scope.deleteRow = function(){
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: './partials/confirmModal.html',
              controller: ModalInstanceCtrl,
              size: 'sm'
            });
            modalInstance.result.then(function() {
              $scope.array.splice($scope.value, 1);
            }, function() {
              //Modal dismissed
            });
        };
    },
    templateUrl: "./partials/editableRowTemplate.html",
  };
}])

.directive("editable", function () {
  return {
      scope: {
          value: "=editable"
      },
      restrict: "A",
      templateUrl: "./partials/editableTemplate.html"
  };
})

.directive("editabledate",function () {
  return {
      scope: {
          value: "=editabledate",
          isOpen: "=",
          open: "&"
      },
      require: '^editablerow',
      restrict: "A",
      templateUrl: "./partials/editableDateTemplate.html",
      link: function ($scope) {
      }
  };
})


.directive("myModal", function($modal){
  return {
      // transclude: true,
      restrict: "EA",
      replace:true,
      template: "<a ng-click='open()' href>{{title}}</a>",
      scope: {
          useCtrl: "@",
          email: "@",
          title: "@"
      },
      link: function(scope, element, attrs) {
          scope.open = function(){
   
              var modalInstance = $modal.open({
                  templateUrl: templateDir + attrs.instanceTemplate + ".html",
                  controller:  scope.useCtrl
              });
          };
      }
  };
})

.directive('ngTranscludeReplace', ['$log', function ($log) {
    return {
        terminal: true,
        restrict: 'EA',

        link: function ($scope, $element, $attr, ctrl, transclude) {
            if (!transclude) {
                $log.error('orphan',
                           'Illegal use of ngTranscludeReplace directive in the template! ' +
                           'No parent directive that requires a transclusion found. ');
                return;
            }
            transclude(function (clone) {
                if (clone.length) {
                    $element.replaceWith(clone);
                }
                else {
                    $element.remove();
                }
            });
        }
    };
}]);