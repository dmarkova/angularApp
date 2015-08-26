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


.service('employeesService', ['$filter', function ($filter) {
    var data = [
	    { 
	        "id": "dariamarkova", 
	        "name": "Daria Markova",
	        "vacations": [
				{
					"start":1420059600000,
                	"end":1423319186000
                }
	        ],
	        "dayoffs": [
	        	{
	        		"date":1423319186000
	        	}
	        ]
	    }, 
	    { 
	        "id": "stepanzakharov", 
	        "name": "Stepan Zakharov",
	        "vacations": [
	        	{
					"start":1420059600000,
	                "end":1423319186000
	            }
	        ],
	        "dayoffs": [
	        	{
	        		"date":1420127784000
	        	}
	        ]
	    }, 
	    { 
	        "id": "natalialastukhina", 
	        "name": "Natalia Lastukhina",
	        "vacations": [
	        	{
					"start":1420059600000,
	                "end":1423319186000
	            }
	        ],
	        "dayoffs": [
	        	{
	        		"date":1420127784000
	        	}
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
        },
        addPrivateCapacity:function (employeeSelected, value, item) {
            // This is a public function that modifies private data
        	if (!employeeSelected[value]) {
	          employeeSelected[value] = [];
	        }
			employeeSelected[value].push(item);
        }
    };
}])

.service('projectsService', ['$filter', function ($filter) {
    var data = [
	    { 
	        "id": "enironoproff", 
	        "name": "EniroNOProff", 
	        "lead": "Sergey Rimsha", 
	        "location": "SPB",
	        "start":1420127784000,
	        "end":1423319186000,
	        "status": "current",
	        "employees": {
	            "dariamarkova": {
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
	            "stepanzakharov": {
	                "capacity": [{
	                    "value":1, 
	                    "start":1420127784000,
	                    "end":1423319186000
	                }]
	            }
	        }
	    }, 
	    { 
	        "id": "sol", 
	        "name": "Scandinavia Online", 
	        "lead": "Lyubov Fedorovich", 
	        "location": "SPB",
	        "start":1420127784000,
	        "end":1420386984000,
	        "status": "pending",
	        "employees": {
	            "dariamarkova": {
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
	            }
	        }
	    }, 
	    { 
	        "id": "carpathia", 
	        "name": "CarpathiaTicketTracking", 
	        "lead": "Dmitry Pimenov", 
	        "location": "SPB",
	        "start":1420300584000,
	        "end":1420559784000,
	        "status": "current",
	        "employees": {
	            "stepanzakharov": {
	                "capacity": [{
	                    "value":0.25, 
	                    "start":1420127784000,
	                    "end":1420559784000
	                }]
	                
	            }
	        }
	    }, 
	    { 
	        "id": "mercerdb", 
	        "name": "Mercer DB", 
	        "lead": "Ebgenia Petrova", 
	        "location": "NN",
	        "start":1420300584000,
	        "end":1420559784000,
	        "status": "current",
	        "employees": {
	            "natalialastukhina": {
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
	        if (!projectSelected.employees[employeeid]) {
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

.service('dateCalcService',  ['$filter', '$resource', function ($filter, $resource) {
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

	dateCalcService.daysInMonth = function (month,year,actual) {
		var monthCounter = new Date(year, month, 0).getDate(),
			today = new Date(),
			todayDay = $filter('date')(today, "d"),
			todayMonth = $filter('date')(today, "M");

		if (actual && month == todayMonth) {
    		return monthCounter - todayDay;
    	} else {
    		return monthCounter;
    	}
    };
    dateCalcService.weeksInMonth = function (month,calendar,actual) {
		var 
			monthName = $filter('monthName')(month),
			weekCounter,
			today = new Date(),
			todayWeek = dateCalcService.getWeek(today),
			todayMonth = $filter('date')(today, "M");

		if (calendar) {
			weekCounter = function() {
				return _.filter(calendar, function(week){ 
		        	return week.month[month]; 
		      	});
			};
			weekCounter = weekCounter.length;

			if (actual && month == todayMonth) {
	    		return weekCounter - todayWeek + 1;
	    	} else {
	    		return weekCounter;
	    	}
	    }
    };

    dateCalcService.checkActualDay = function (day) {
    	var today = new Date();
    	return day.date < today;
    };
    dateCalcService.checkActualMonth = function (month) {
    	var today = new Date(),
    		todayMonth = $filter('date')(today, "M");
    	return month < todayMonth;
    };
    dateCalcService.checkActualWeek = function (week) {
    	var today = new Date(),
    		todayWeek = dateCalcService.getWeek(today);
    	return week < todayWeek;
    };

    dateCalcService.getCalendar = function (year) {
    	var dateRange = {
	      startDate: "1 January",
	      endDate: "31 December"
	    },
   		startDate = new Date(year + ' ' + dateRange.startDate),
		endDate = new Date(year + ' ' +  dateRange.endDate),
		nextDate = new Date(startDate),
		calendarResource = [],
		calendar = [];

		calendarResource = $resource('projects/calendar-'+ year + '.json');
		calendar = calendarResource.query();
		calendar.$promise.then(function (result) {
		    calendar = result;
		}, function (error) {
			while (nextDate <= endDate) {
				var dateObj = {};
				dateObj.date = dateCalcService.createTimestamp(nextDate);
				calendar.push(dateObj);
				nextDate.setDate(nextDate.getDate()+1);
			}
		});

		return calendar;
		
	};

	dateCalcService.getWeekCalendar = function (year) {
		var dateRange = {
				startDate: "1 January",
				endDate: "31 December"
			},
			numberWeeks =  parseInt(dateCalcService.getWeek(new Date(year + ' ' +  dateRange.endDate))),
			calendarResource = [],
			calendar = [];

		calendarResource = $resource('projects/calendar-week-'+ year + '.json');
		calendar = calendarResource.query();
		calendar.$promise.then(function (result) {
		    calendar = result;
		}, function (error) {
			for (var i = 1; i <= numberWeeks; i++) {
				var dateObj = {};
				dateObj.number = i;
				dateObj.month = dateCalcService.getMonth(i,year);
				calendar.push(dateObj);
			}
		});
		return calendar;
		
	};

    return dateCalcService;
}]);
