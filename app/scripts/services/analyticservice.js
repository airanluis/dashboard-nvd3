'use strict';

/**
 * @ngdoc service
 * @name mementoWebApp.AnalyticService
 * @description
 * # AnalyticService
 * Service in the mementoWebApp.
 */
angular.module('mementoWebApp')
	.service('AnalyticService', ['$http', 'aiStorage', 'ENV',
		function AnalyticService($http, aiStorage, ENV) {
			this.query = function(query) {
				return $http({
					method: 'GET',
					url: ENV.servicesUrl + '/data?query=' + query,
					headers: {
						'Authorization': 'Basic ' + aiStorage.get('user').credential
					}
				}).then(function(response) {
					return response.data;
				});
			};

		}
	]);