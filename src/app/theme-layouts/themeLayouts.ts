import { i18nNamespaces } from 'app/constants';
import i18next from 'i18next';
import React, { ComponentType } from 'react';
import en from './i18n/en';
import fa from './i18n/fa';
import Layout1 from './layout1/Layout1';
import Layout2 from './layout2/Layout2';
import Layout3 from './layout3/Layout3';
import MainLayout from './mainLayout/MainLayout';

i18next.addResourceBundle('en', i18nNamespaces.layoutComponents, en);
i18next.addResourceBundle('fa', i18nNamespaces.layoutComponents, fa);

/**
 * The type definition for the theme layouts.
 */
export type themeLayoutsType = {
	[key: string]: ComponentType<{ children?: React.ReactNode }>;
};

/**
 * The theme layouts.
 */
const themeLayouts: themeLayoutsType = {
	mainLayout: MainLayout,
	layout1: Layout1,
	layout2: Layout2,
	layout3: Layout3
};

export default themeLayouts;
