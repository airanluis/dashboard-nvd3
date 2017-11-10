'use strict';

/**
 * @ngdoc function
 * @name mementoWebApp.controller:chartController
 * @description
 * # chartController
 * Controller of the mementoWebApp
 */
angular.module('mementoWebApp')
	.controller('chartController', ['$scope', 'AnalyticService', 'ChartService',
		function($scope, AnalyticService, ChartService) {

			$scope.createChart = function(chart) {
				$scope.chart.options = ChartService.chartFactory(chart.type);
				AnalyticService.query(chart.query).then(function(data) {
					$scope.chart.data = $scope.chart.options.convertData(data);
				});
			};
		}
	]);