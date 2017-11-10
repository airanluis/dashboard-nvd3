'use strict';

describe('Controller: BarchartcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('mementoWebApp'));

  var BarchartcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BarchartcontrollerCtrl = $controller('BarchartcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
