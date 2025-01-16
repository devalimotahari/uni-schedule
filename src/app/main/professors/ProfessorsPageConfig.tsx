import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import { paths } from 'app/configs/paths';
import { lazy } from 'react';

const Page = lazy(() => import('./ProfessorsPage'));

const ProfessorsPageConfig: FuseRouteConfigType = {
	settings: {},
	routes: [
		{
			path: paths.professors,
			element: <Page />
		}
	]
};

export default ProfessorsPageConfig;
