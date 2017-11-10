'use strict';

/**
 * @ngdoc function
 * @name mementoWebApp.PieChart
 * @description
 * # PieChart
 * Service of the mementoWebApp
 */
angular.module('mementoWebApp')
	.factory('PieChart', [

		function() {
			function PieChart() {
				this.chart = {
					type: 'pieChart',
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
					transitionDuration: 500
				};
			}

			PieChart.prototype.convertData = function(data) {
				return data[0].values;
			};

			return PieChart;
		}
	]);