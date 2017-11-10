'use strict';

/**
 * @ngdoc function
 * @name mementoWebApp.LineChart
 * @description
 * # LineChart
 * Service of the mementoWebApp
 */
angular.module('mementoWebApp')
	.factory('LineChart', [

		function() {
			function LineChart() {
				this.chart = {
					type: 'lineChart',
					margin: {
						top: 20,
						right: 20,
						bottom: 60,
						left: 55
					},
					x: function(d) {
						return d.label;
					},
					y: function(d) {
						return d.value;
					},
					showValues: true,
					transitionDuration: 500,
					yAxis: {
						axisLabel: 'Y Axis',
						axisLabelDistance: 30
					},
					xAxis: {
						axisLabel: 'Date',
						tickFormat: function(d) {
							return d3.time.format('%e')(new Date(d));
						}
					}
				};
			}

			LineChart.prototype.convertData = function(data) {
				return data;
			};

			return LineChart;
		}
	]);