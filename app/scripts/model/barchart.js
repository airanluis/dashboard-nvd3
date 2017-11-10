'use strict';

/**
 * @ngdoc function
 * @name mementoWebApp.BarChart
 * @description
 * # BarChart
 * Service of the mementoWebApp
 */
angular.module('mementoWebApp')
	.factory('BarChart', [

		function() {
			function BarChart() {
				this.chart = {
					type: 'discreteBarChart',
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
					valueFormat: function(d) {
						return d3.format(',.4f')(d);
					},
					transitionDuration: 500,
					xAxis: {
						axisLabel: 'X Axis'
					},
					yAxis: {
						axisLabel: 'Y Axis',
						axisLabelDistance: 30
					}
				};
			}

			BarChart.prototype.convertData = function(data) {
				return [data[0]];
			};

			return BarChart;
		}
	]);