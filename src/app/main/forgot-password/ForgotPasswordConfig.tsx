import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { i18nNamespaces } from 'app/constants';
import i18next from 'i18next';
import ForgotPasswordPage from './ForgotPasswordPage';
import authRoles from '../../auth/authRoles';
import fa from './i18n/fa';

i18next.addResourceBundle('fa', i18nNamespaces.pages.forgotPassword, fa);

const ForgotPasswordConfig: FuseRouteConfigType = {
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
			path: 'forgot-password',
			element: <ForgotPasswordPage />
		}
	]
};

export default ForgotPasswordConfig;
