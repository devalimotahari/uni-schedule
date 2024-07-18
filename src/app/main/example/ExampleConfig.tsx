import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { i18nNamespaces } from 'app/constants';
import i18next from 'i18next';
import { lazy } from 'react';
import ar from './i18n/ar';
import en from './i18n/en';
import tr from './i18n/tr';

i18next.addResourceBundle('en', i18nNamespaces.pages.example, en);
i18next.addResourceBundle('tr', i18nNamespaces.pages.example, tr);
i18next.addResourceBundle('ar', i18nNamespaces.pages.example, ar);

const Example = lazy(() => import('./Example'));

/**
 * The Example page config.
 */
const ExampleConfig: FuseRouteConfigType = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'example',
			element: <Example />
		}
	]
};

export default ExampleConfig;
