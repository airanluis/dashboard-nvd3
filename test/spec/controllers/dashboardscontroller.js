'use strict';

describe('Controller: DashboardscontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('mementoWebApp'));

  var DashboardscontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DashboardscontrollerCtrl = $controller('DashboardscontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
