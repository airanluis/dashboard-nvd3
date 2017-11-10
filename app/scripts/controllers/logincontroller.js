'use strict';

/**
 * @ngdoc function
 * @name mementoWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mementoWebApp
 */
angular.module('mementoWebApp')
  .controller('loginController',['$scope', 'AuthService', function($scope, AuthService) {
    $scope.onText = 'SÍ';
    $scope.offText = 'NO';
    $scope.isActive = true;
    $scope.size = 'small';
    $scope.animate = true;
    $scope.onColor = '#da5132';
    $scope.offColor = '#da5132';
    $scope.isRemember = true;
    $scope.pageClass = 'home fullpage';
    
    $scope.logIn = function() {
      AuthService.login(this.usernameInput, this.passwordInput, $scope.isRemember);
    };
  }]);