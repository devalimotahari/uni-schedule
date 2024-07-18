import FuseMessage from '@fuse/core/FuseMessage';
import { selectFuseCurrentLayoutConfig } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import FuseSuspense from '@fuse/core/FuseSuspense';
import { styled } from '@mui/material/styles';
import AppContext from 'app/AppContext';
import { useAppSelector } from 'app/store/hooks';
import { MainLayoutConfigDefaultsType } from 'app/theme-layouts/mainLayout/MainLayoutConfig';
import { lazy, memo, ReactNode, Suspense, useContext } from 'react';
import { useRoutes } from 'react-router-dom';
import NavbarWrapperMainLayout from './components/NavbarWrapperMainLayout';

const FuseDialog = lazy(() => import('@fuse/core/FuseDialog/FuseDialog'));

const Root = styled('div')(({ config }: { config: MainLayoutConfigDefaultsType }) => ({
	...(config.mode === 'boxed' && {
		clipPath: 'inset(0)',
		maxWidth: `${config.containerWidth}px`,
		margin: '0 auto',
		boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
	}),
	...(config.mode === 'container' && {
		'& .container': {
			maxWidth: `${config.containerWidth}px`,
			width: '100%',
			margin: '0 auto'
		}
	})
}));

type MainLayoutProps = {
	children?: ReactNode;
};

/**
 * The layout 1.
 */
function MainLayout(props: MainLayoutProps) {
	const { children } = props;
	const config = useAppSelector(selectFuseCurrentLayoutConfig) as MainLayoutConfigDefaultsType;
	const appContext = useContext(AppContext);
	const { routes } = appContext;

	return (
		<Root
			id="fuse-layout"
			config={config}
			className="flex w-full"
		>
			<div className="flex min-w-0 flex-auto">
				<NavbarWrapperMainLayout />

				<main
					id="fuse-main"
					className="relative z-10 flex min-h-full min-w-0 flex-auto flex-col"
				>
					<div className="relative z-10 flex min-h-0 flex-auto flex-col">
						<FuseSuspense>{useRoutes(routes)}</FuseSuspense>

						<Suspense>
							<FuseDialog />
						</Suspense>
						{children}
					</div>
				</main>
			</div>
			<FuseMessage />
		</Root>
	);
}

export default memo(MainLayout);
