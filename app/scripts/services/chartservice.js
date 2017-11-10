'use strict';

/**
 * @ngdoc service
 * @name mementoWebApp.ChartService
 * @description
 * # ChartService
 * Service in the mementoWebApp.
 */
angular.module('mementoWebApp')
	.service('ChartService', ['LineChart', 'BarChart', 'PieChart', 'HBarChart',
		function(LineChart, BarChart, PieChart, HBarChart) {

			this.options = null;
			this.data = [];
			this.dataOriginal = [];
			this.chart = null;

			this.createChart = function(type) {
				this.chart = this.chartFactory(type);
				this.options = this.chart;
				if (this.dataOriginal.length > 0) {
					this.data = this.chart.convertData(this.dataOriginal);
				}
			};

			this.setData = function(data) {
				this.dataOriginal = data;
				this.data = this.chart.convertData(this.dataOriginal);
			};

			this.chartFactory = function(type) {
				switch (type) {
					case 'line':
						return new LineChart();
					case 'bar':
						return new BarChart();
					case 'pie':
						return new PieChart();
					case 'hbar':
						return new HBarChart();
				}
			};
		}
	]);