angular.module('mementoWebApp').
directive('autofill', [

	function() {
		return {
			link: function(scope) {
				scope.submit = function() {
					if (!scope.usernameInput) {
						scope.usernameInput = $('#username').val();
					}
					if (!scope.passwordInput) {
						scope.passwordInput = $('#password').val();
					}
					scope.logIn();
				}
			}
		};
	}
]);