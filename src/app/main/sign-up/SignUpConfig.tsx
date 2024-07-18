import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { i18nNamespaces } from 'app/constants';
import i18next from 'i18next';
import fa from './i18n/fa';
import SignUpPage from './SignUpPage';
import authRoles from '../../auth/authRoles';

i18next.addResourceBundle('fa', i18nNamespaces.pages.signUp, fa);

const SignUpConfig: FuseRouteConfigType = {
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
			path: 'sign-up',
			element: <SignUpPage />
		}
	]
};

export default SignUpConfig;
