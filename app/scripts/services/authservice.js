'use strict';

/**
 * @ngdoc service
 * @name mementoWebApp.AuthService
 * @description
 * # AuthService
 * Service in the mementoWebApp.
 */
angular.module('mementoWebApp')
	.service('AuthService', ['$http', 'aiStorage', '$state','ENV', function AuthService($http, aiStorage, $state, ENV) {
		this.login = function(username, password, isRemember) {
			var credential = window.btoa(unescape(encodeURIComponent([username, password].join(':'))));
			$http({
				method: 'GET',
				url: ENV.authUrl + '/users/me',
				headers: {
					'Authorization': 'Basic ' + credential
				}
			}).success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				data.credential = credential; 
				aiStorage.set('user', data);
				if (isRemember) {
					aiStorage.set('user', data, 'session');
				}
				$state.go('session.widgets');
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});;
		};

		this.logout = function() {
			aiStorage.remove('user');
			aiStorage.remove('user', 'session');
			$state.go('login');
		};

		this.isAuthenticated = function() {
			if (aiStorage.get('user') || aiStorage.get('user', 'session')) {
				return true;
			}
			return false;
		};


	}]);