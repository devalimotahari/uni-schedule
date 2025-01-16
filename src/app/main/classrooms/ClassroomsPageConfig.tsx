import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { paths } from 'app/configs/paths';
import { lazy } from 'react';

const Page = lazy(() => import('./ClassroomsPage'));

const ClassroomsPageConfig: FuseRouteConfigType = {
	settings: {},
	routes: [
		{
			path: paths.classrooms,
			element: <Page />
		}
	]
};

export default ClassroomsPageConfig;
