'use strict';

describe('Controller: WidgetscontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('mementoWebApp'));

  var WidgetscontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WidgetscontrollerCtrl = $controller('WidgetscontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
