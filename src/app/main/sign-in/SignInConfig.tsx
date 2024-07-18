import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { i18nNamespaces } from 'app/constants';
import i18next from 'i18next';
import SignInPage from './SignInPage';
import authRoles from '../../auth/authRoles';
import fa from './i18n/fa';

i18next.addResourceBundle('fa', i18nNamespaces.pages.signIn, fa);

const SignInConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'sign-in',
			element: <SignInPage />
		}
	]
};

export default SignInConfig;
