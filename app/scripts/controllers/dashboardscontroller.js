'use strict';

/**
 * @ngdoc function
 * @name mementoWebApp.controller:dashboardsController
 * @description
 * # dashboardsController
 * Controller of the mementoWebApp
 */
angular.module('mementoWebApp')
	.controller('dashboardsController', ['$scope', 'AnalyticService',
		function($scope, AnalyticService) {
			$scope.gridsterOptions = {
				margins: [20, 20],
				columns: 4,
				colWidth: 'auto',
				rowHeight: 'match',
				floating: true,
				pushing: false,
				minRows: 4,
				draggable: {
					handle: '.box-header',
					enabled: true
				},
				resizable: {
					enabled: true,
					stop: function(event, $element, widget) {
						$(window).trigger('resize');
					},
				}
			};

			$scope.dashboard = {
				id: '1',
				name: 'Home',
				widgets: [{
					col: 0,
					row: 0,
					sizeY: 1,
					sizeX: 1,
					name: 'Widget 1',
					charts: [{
						type: 'line',
						query: 'select * from table group by hourly'
					}]
				}, {
					col: 1,
					row: 0,
					sizeY: 1,
					sizeX: 1,
					name: 'Widget 2',
					charts: [{
						type: 'bar',
						query: 'select * from table'
					}]
				}]
			};
		}
	]);