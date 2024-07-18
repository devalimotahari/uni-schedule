import { i18nNamespaces } from 'app/constants';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import validationMessagesFa from 'app/configs/validationMessages-i18n/fa';

/**
 * resources is an object that contains all the translations for the different languages.
 */
const resources = {
	en: {
		translation: {
			'Welcome to React': 'Welcome to React and react-i18next'
		}
	},
	fa: {
		translation: {
			'Welcome to React': 'خوش آمدید'
		}
	}
};

/**
 * i18n is initialized with the resources object and the language to use.
 * The keySeparator option is set to false because we do not use keys in form messages.welcome.
 * The interpolation option is set to false because we do not use interpolation in form messages.welcome.
 */
i18n.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		lng: 'fa',

		keySeparator: false, // we do not use keys in form messages.welcome

		interpolation: {
			escapeValue: false // react already safes from xss
		}
	});

i18n.addResourceBundle('fa', i18nNamespaces.validationMessages, validationMessagesFa);

export default i18n;
