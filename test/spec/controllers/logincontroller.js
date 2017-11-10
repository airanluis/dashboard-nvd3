'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('mementoWebApp'));

  var LoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    loginCtrl = $controller('loginCtrl', {
      $scope: scope
    });
  }));
  
});
