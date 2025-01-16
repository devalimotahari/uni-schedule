import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { paths } from 'app/configs/paths';
import { lazy } from 'react';

const Page = lazy(() => import('./MajorsPage'));

const MajorsPageConfig: FuseRouteConfigType = {
	settings: {},
	routes: [
		{
			path: paths.majors,
			element: <Page />
		}
	]
};

export default MajorsPageConfig;
