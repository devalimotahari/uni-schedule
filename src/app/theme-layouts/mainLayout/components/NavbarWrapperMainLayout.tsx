import { ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import { selectFuseCurrentLayoutConfig, selectNavbarTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { MainLayoutConfigDefaultsType } from 'app/theme-layouts/mainLayout/MainLayoutConfig';
import NavbarToggleFabMainLayout from 'app/theme-layouts/mainLayout/components/NavbarToggleFabMainLayout';
import { useLocation } from 'react-router';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { navbarCloseMobile, selectFuseNavbar } from 'app/theme-layouts/shared-components/navbar/navbarSlice';
import MainLayoutNavbar from './MainLayoutNavbar';

/**
 * The navbar wrapper layout 1.
 */
function NavbarWrapperMainLayout() {
	const config = useAppSelector(selectFuseCurrentLayoutConfig) as MainLayoutConfigDefaultsType;
	const navbar = useAppSelector(selectFuseNavbar);
	const location = useLocation();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { pathname } = location;
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (isMobile) {
			dispatch(navbarCloseMobile());
		}
	}, [pathname, isMobile]);

	const navbarTheme = useAppSelector(selectNavbarTheme);

	return (
		<>
			<ThemeProvider theme={navbarTheme}>
				<MainLayoutNavbar />
			</ThemeProvider>
			{config.navbar.display && !config.toolbar.display && !navbar.open && <NavbarToggleFabMainLayout />}
		</>
	);
}

export default NavbarWrapperMainLayout;
