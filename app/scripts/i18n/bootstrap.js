/**
 * Inits the i18n library, including the literals storage.
 */
define(['jquery', 'i18next', 'json!i18n/literals.json', 'json!i18n/literals-en.json', 'json!i18n/literals-es.json'],

function($, i18next, DefaultLocales, EnglishLocales, SpanishLocales) {

	var resourcesStore = {
		'dev': {
			translation: DefaultLocales
		},
		'en': {
			translation: EnglishLocales
		},
		'es': {
			translation: SpanishLocales
		}
	};

	return {
		initialize: function() {
			$.i18n.init({
				resStore: resourcesStore,
				useCookie: false
			});
		}
	};
});