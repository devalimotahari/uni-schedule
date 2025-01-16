import { i18nNamespaces } from 'app/constants';
import i18next from 'i18next';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import { paths } from 'app/configs/paths';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';
import fa from './navigation-i18n/fa';

i18next.addResourceBundle('en', i18nNamespaces.navigation, en);
i18next.addResourceBundle('tr', i18nNamespaces.navigation, tr);
i18next.addResourceBundle('ar', i18nNamespaces.navigation, ar);
i18next.addResourceBundle('fa', i18nNamespaces.navigation, fa);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'majors',
		title: 'Majors',
		translate: 'MAJORS',
		type: 'item',
		icon: 'heroicons-outline:academic-cap',
		url: paths.majors
	},
	{
		id: 'classrooms',
		title: 'Classrooms',
		translate: 'CLASSROOMS',
		type: 'item',
		icon: 'heroicons-outline:home',
		url: paths.classrooms
	},
	{
		id: 'professors',
		title: 'Professors',
		translate: 'PROFESSORS',
		type: 'item',
		icon: 'heroicons-outline:user',
		url: paths.professors
	},
	{
		id: 'courses',
		title: 'Courses',
		translate: 'COURSES',
		type: 'item',
		icon: 'material-outline:class',
		url: paths.courses
	},
	{
		id: 'calendar',
		title: 'Calendar',
		translate: 'CALENDAR',
		type: 'item',
		icon: 'heroicons-outline:calendar',
		url: paths.calendar
	}
];

export default navigationConfig;
