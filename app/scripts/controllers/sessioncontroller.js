'use strict';

/**
 * @ngdoc function
 * @name mementoWebApp.controller:dashboardsController
 * @description
 * # dashboardsController
 * Controller of the mementoWebApp
 */
angular.module('mementoWebApp')
  .controller('sessionController',['$scope', 'aiStorage', 'AuthService', function($scope, aiStorage, AuthService) {
    $scope.pageClass = 'sessionPage';

    $scope.toggle = true;
    $scope.username = aiStorage.get('user').username;
    $scope.logoUrl = aiStorage.get('user').logo;

    $scope.toggleSidebar = function() 
    {
        $scope.toggle = ! $scope.toggle;
    };

    $('.sidebar .sidebar-list').click(function(){
        $('.sidebar .sidebar-list').removeClass('menu_active');
        $(this).addClass('menu_active');
    });

    window.onresize = function() { 
        //$scope.$apply(); 
    };

    $scope.logout = function() 
    {
        AuthService.logout();
    };
    
  }]);
