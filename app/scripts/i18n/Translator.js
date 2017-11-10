define(['i18next'],

	function(i18next) {

		return {
			getMsg: function(key) {
				return function() {
					return i18next.t(key);
				};
			}
		};

	});