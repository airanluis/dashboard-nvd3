"use strict";

 angular.module('config', [])

.constant('ENV', {name:'development',servicesUrl:'http://localhost:3001/memento-analytics-service',authUrl:'http://localhost:3001/memento-security-service'})

;