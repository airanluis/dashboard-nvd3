'use strict';

/**
 * @ngdoc overview
 * @name mementoWebApp
 * @description
 * # mementoWebApp
 *
 * Main module of the application.
 */
var app = angular.module('mementoWebApp', [
	'frapontillo.bootstrap-switch',
	'config',
	'ui.router',
	'ui.bootstrap',
	'angular-storage',
	'ngAnimate',
	'ui.ace',
	'nvd3',
	'gridster'
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

	$stateProvider
		.state('login', {
			url: '/',
			templateUrl: 'views/login.html',
			controller: 'loginController'
		})
		.state('session', {
			url: '/home',
			templateUrl: 'views/session.html',
			controller: 'sessionController',
			authenticate: true
		})
		.state('session.widgets', {
			url: '/widgets',
			templateUrl: 'views/partials/widgets.html',
			controller: 'widgetsController',
			authenticate: true
		})
		.state('session.dashboards', {
			url: '/dashboards',
			templateUrl: 'views/partials/dashboards.html',
			controller: 'dashboardsController',
			authenticate: true
		});

	$urlRouterProvider.otherwise('/home/widgets');

	// use the HTML5 History API
	//$locationProvider.html5Mode(true);

	// Intercept 401s and 403s and redirect you to login
	$httpProvider.interceptors.push(['$q', '$location',
		function($q, $location) {
			return {
				'responseError': function(response) {
					if (response.status === 401 || response.status === 403) {
						$location.path('/');
						return $q.reject(response);
					} else {
						return $q.reject(response);
					}
				}
			};
		}
	]);
})
	.run(function($rootScope, $state, AuthService) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		if (toState.authenticate && !AuthService.isAuthenticated()) {
			// User isn’t authenticated
			$state.transitionTo('login');
			event.preventDefault();
		}
	});
});
