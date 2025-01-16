import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import { paths } from 'app/configs/paths';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import Error404Page from '../main/404/Error404Page';
import CalendarAppConfig from '../main/calendar/CalendarAppConfig';
import MajorsPageConfig from '../main/majors/MajorsPageConfig';
import ProfessorsPageConfig from '../main/professors/ProfessorsPageConfig';
import CoursesPageConfig from '../main/courses/CoursesPageConfig';
import ClassroomsPageConfig from '../main/classrooms/ClassroomsPageConfig';

const routeConfigs: FuseRouteConfigsType = [
	CalendarAppConfig,
	SignInConfig,
	SignUpConfig,
	MajorsPageConfig,
	ProfessorsPageConfig,
	CoursesPageConfig,
	ClassroomsPageConfig
];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to={paths.calendar} />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: 'loading',
		element: <FuseLoading />
	},
	{
		path: '404',
		element: <Error404Page />
	},
	{
		path: '*',
		element: <Navigate to="404" />
	}
];

export default routes;
