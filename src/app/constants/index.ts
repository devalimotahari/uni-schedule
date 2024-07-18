export const i18nNamespaces = {
	pages: {
		signIn: 'signInPage',
		signUp: 'signUpPage',
		signOut: 'signOutPage',
		forgotPassword: 'forgotPasswordPage',
		example: 'examplePage'
	},
	validationMessages: 'validationMessages',
	navigation: 'navigation',
	layoutComponents: 'layout-components'
};

export const RegExps = {
	email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
	mobile: /^9\d{9}$/,
	username: /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
	nationalCode: /^[0-9]{10}$/,
	sheba: /^IR(?=.{24}$)[0-9]*$/,
	password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,30}$/
};

export const LocalStorageKeys = {
	jwtToken: 'jwt-access-token',
	autoLoginToken: 'auto-login-token'
};
