import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { paths } from 'app/configs/paths';
import { lazy } from 'react';

const Page = lazy(() => import('./CoursesPage'));

const CoursesPageConfig: FuseRouteConfigType = {
	settings: {},
	routes: [
		{
			path: paths.courses,
			element: <Page />
		}
	]
};

export default CoursesPageConfig;
