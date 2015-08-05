'use strict';

angular.module('capacityAppServices', [])
/* Services */

.factory('employeesService', function($resource) {
  return $resource('projects/employees.json')
})
.factory('projectsService', function($resource) {
  return $resource('projects/projects.json')
})
.factory('calendarService', function($resource) {
  return $resource('projects/calendar.json')
});
