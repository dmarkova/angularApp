'use strict';

angular.module('capacityAppServices', [])
/* Services */

// .factory('employeesService', function($resource) {
//   return $resource('projects/employees.json')
// })
// .factory('projectsService', function($resource) {
//   return $resource('projects/projects.json')
// })
// .factory('calendarService', function($resource) {
//   return $resource('projects/calendar.json')
// });


.service('employeesService', function () {
    var data = [
	    { 
	        "id": 1, 
	        "name": "Daria Markova",
	        "projects": [
	           	"1",
	            "2"
	        ]
	    }, 
	    { 
	        "id": 2, 
	        "name": "Stepan Zakharov",
	        "projects": [
	            "3"
	        ]
	    }
    ];

    return {
        employees:function () {
            // This exposed private data
            return data;
        },
        addEmployee:function (employee) {
            // This is a public function that modifies private data
            data.push(employee);
        },
        deleteEmployee:function (id) {
            // This is a public function that modifies private data
        }
    };
})

.service('projectsService', ['$filter', function ($filter) {
    var data = [
	    { 
	        "id": 1, 
	        "name": "EniroNOProff", 
	        "lead": "Sergey Rimsha", 
	        "location": "SPB",
	        "start":1420127784000,
	        "end":1423319186000,
	        "status": "current",
	        "employees": {
	            "1": {
	                "capacity":  [
	                    {
	                    "value":0.75, 
	                    "start":1420127784000,
	                    "end":1422195986000
	                    },
	                    {
	                    "value":0.25, 
	                    "start":1423319186000,
	                    "end":1423319186000
	                    }
	                ]
	            },
	            "2": {
	                "capacity": [{
	                    "value":4, 
	                    "start":1420127784000,
	                    "end":1423319186000
	                }]
	            }
	        }
	    }, 
	    { 
	        "id": 2, 
	        "name": "Scandinavia Online", 
	        "lead": "Lyubov Fedorovich", 
	        "location": "SPB",
	        "start":1420127784000,
	        "end":1420386984000,
	        "status": "pending",
	        "employees": {
	            "1": {
	                "capacity":  [
	                    {
	                    "value":0.75, 
	                    "start":1420127784000,
	                    "end":1420386984000
	                    },
	                    {
	                    "value":0.25, 
	                    "start":1420386984000,
	                    "end":1420559784000
	                    }
	                ]
	            },
	            "2": {
	                "capacity": [{
	                    "value":0.25, 
	                    "start":1420127784000,
	                    "end":1420559784000
	                }]
	                
	            }
	        }
	    }, 
	    { 
	        "id": 3, 
	        "name": "CarpathiaTicketTracking", 
	        "lead": "Dmitry Pimenov", 
	        "location": "SPB",
	        "start":1420300584000,
	        "end":1420559784000,
	        "status": "current",
	        "employees": {
	            "1": {
	                "capacity":  [
	                    {
	                    "value":0.75, 
	                    "start":1420127784000,
	                    "end":1420386984000
	                    },
	                    {
	                    "value":0.25, 
	                    "start":1420386984000,
	                    "end":1420559784000
	                    }
	                ]
	            },
	            "2": {
	                "capacity": [{
	                    "value":0.25, 
	                    "start":1420127784000,
	                    "end":1420559784000
	                }]
	                
	            }
	        }
	    }, 
	    { 
	        "id": 4, 
	        "name": "Mercer DB", 
	        "lead": "Ebgenia Petrova", 
	        "location": "NN",
	        "start":1420300584000,
	        "end":1420559784000,
	        "status": "current",
	        "employees": {
	            "1": {
	                "capacity":  [
	                    {
	                    "value":0.75, 
	                    "start":1420127784000,
	                    "end":1420386984000
	                    },
	                    {
	                    "value":0.25, 
	                    "start":1420386984000,
	                    "end":1420559784000
	                    }
	                ]
	            },
	            "2": {
	                "capacity": [{
	                    "value":0.25, 
	                    "start":1420127784000,
	                    "end":1420559784000
	                }]
	                
	            }
	        }
	    }
	];

    return {
        projects:function () {
            // This exposed private data
            return data;
        },
        addProject:function (project) {
            // This is a public function that modifies private data
            data.push(project);
        },
        deleteProject:function (id) {
            // This is a public function that modifies private data
        },
        addCapacity:function (projectid, employeeid, item) {
        	// This is a public function that modifies private data
        	var projectSelected = $filter('getById')(data, projectid);

        	if (!projectSelected.employees) {
	          projectSelected.employees = {};
	          projectSelected.employees[employeeid] = {
	            "capacity": []
	          };
	        }

			projectSelected.employees[employeeid].capacity.push(item);
        }
    };
}])

.service('datepickerService', function () {
    return {
		format: 'dd MMMM yyyy',

    	options: {
	      startingDay: 1
	    }
	}
})

.service('dateCalcService',  ['$filter', function ($filter) {
	var dateCalcService = {};

    dateCalcService.createTimestamp = function(date) {
		return Math.floor(date.getTime());
	};
    dateCalcService.getWeek = function(item){
  		return $filter('date')(item, "w"); 
    };
	     
	dateCalcService.getDate = function (weekNum, year) {
  		return new Date(year, 0, (1 + (weekNum - 1) * 7));
    };

	dateCalcService.getMonth = function (weekNum, year) {
		var date =  dateCalcService.getDate(weekNum, year),
		  month = '';

		date = dateCalcService.createTimestamp(date);
		month = $filter('date')(date, "MMMM");

		return month;
    };

    return dateCalcService;
}])
