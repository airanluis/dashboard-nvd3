'use strict';

/**
 * @ngdoc function
 * @name mementoWebApp.controller:widgetsController
 * @description
 * # widgetsController
 * Controller of the mementoWebApp
 */
angular.module('mementoWebApp')
	.controller('widgetsController', ['$scope', '$state', 'ChartService', 'AnalyticService',
		function($scope, $state, ChartService, AnalyticService) {
			$scope.aceLoaded = function(_editor) {
				_editor.setHighlightActiveLine(false);
				var _session = _editor.getSession();
				_session.setMode('ace/mode/sql');
				_editor.setOptions({
					enableBasicAutocompletion: true,
					enableSnippets: true,
					enableLiveAutocompletion: false
				});
			};
			$scope.chartType = 'line';			
			$scope.chart = ChartService;

			$scope.$watch('chartType', function(value) {				
				ChartService.createChart(value);
			});

			$scope.updateQuery = function() {
				AnalyticService.query($scope.query).then(function(data) {
					ChartService.setData(data);
				});
			};
		}
	]);