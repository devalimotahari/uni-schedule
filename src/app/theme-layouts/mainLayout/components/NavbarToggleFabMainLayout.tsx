import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { selectFuseCurrentLayoutConfig } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { MainLayoutConfigDefaultsType } from 'app/theme-layouts/mainLayout/MainLayoutConfig';
import { navbarToggle, navbarToggleMobile } from 'app/theme-layouts/shared-components/navbar/navbarSlice';
import NavbarToggleFab from 'app/theme-layouts/shared-components/navbar/NavbarToggleFab';

type NavbarToggleFabMainLayoutProps = {
	className?: string;
};

/**
 * The navbar toggle fab layout 1.
 */
function NavbarToggleFabMainLayout(props: NavbarToggleFabMainLayoutProps) {
	const { className } = props;

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const config = useAppSelector(selectFuseCurrentLayoutConfig) as MainLayoutConfigDefaultsType;

	const dispatch = useAppDispatch();

	if (!isMobile) return null;

	return (
		<NavbarToggleFab
			className={className}
			onClick={() => {
				dispatch(isMobile ? navbarToggleMobile() : navbarToggle());
			}}
			position={config.navbar.position}
		/>
	);
}

export default NavbarToggleFabMainLayout;
