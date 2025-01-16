import { lazy } from 'react';
import { paths } from 'app/configs/paths';

const CalendarApp = lazy(() => import('./CalendarApp'));

/**
 * The Calendar App Config.
 */
const CalendarAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: paths.calendar,
			element: <CalendarApp />
		}
	]
};

export default CalendarAppConfig;
