import ThemeFormConfigTypes from '@fuse/core/FuseSettings/ThemeFormConfigTypes';
import mainLayout, { MainLayoutConfigDefaultsType } from './mainLayout/MainLayoutConfig';

/**
 * The type definition for the theme layout defaults.
 */
export type themeLayoutDefaultsProps = MainLayoutConfigDefaultsType;

/**
 * The type definition for the theme layout.
 */
export type themeLayoutProps = {
	title: string;
	defaults: themeLayoutDefaultsProps;
	form?: ThemeFormConfigTypes;
};

/**
 * The type definition for the theme layout configs.
 */
export type themeLayoutConfigsProps = {
	[key: string]: themeLayoutProps;
};

/**
 * The theme layout configs.
 */
const themeLayoutConfigs: themeLayoutConfigsProps = {
	mainLayout: mainLayout as themeLayoutProps
};

export default themeLayoutConfigs;
