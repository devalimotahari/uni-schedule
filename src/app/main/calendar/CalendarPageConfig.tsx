import { lazy } from 'react';
import { paths } from 'app/configs/paths';

const CalendarApp = lazy(() => import('./CalendarPage'));

/**
 * The Calendar App Config.
 */
const CalendarPageConfig = {
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

export default CalendarPageConfig;
