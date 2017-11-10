angular.module('mementoWebApp')
.controller('customWidgetController', ['$scope', '$modal',
	function($scope, $modal) {

		$scope.remove = function(widget) {
			$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
		};

		$scope.openSettings = function(widget) {
			$modal.open({
				scope: $scope,
				templateUrl: 'views/partials/widget_settings.html',
				controller: 'widgetSettingsController',
				resolve: {
					widget: function() {
						return widget;
					}
				}
			});
		};

	}
]);