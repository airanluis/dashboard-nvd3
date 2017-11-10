'use strict';

/**
 * @ngdoc function
 * @name mementoWebApp.HBarChart
 * @description
 * # HBarChart
 * Service of the mementoWebApp
 */
angular.module('mementoWebApp')
	.factory('HBarChart', [

		function() {
			function HBarChart() {
				this.chart = {
					type: 'multiBarHorizontalChart',
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
					showControls: true,
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

			HBarChart.prototype.convertData = function(data) {
				return [data[0]];
			};

			return HBarChart;
		}
	]);