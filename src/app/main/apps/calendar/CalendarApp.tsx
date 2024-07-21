import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { EventContentArg } from '@fullcalendar/core';
import CalendarAppCoursesSidebar from './CalendarAppCoursesSidebar';
import CalendarHeader from './CalendarHeader';
import CalendarAppProfessorsSidebar from './CalendarAppProfessorsSidebar';
import CalendarAppEventContent from './CalendarAppEventContent';
import { IEvent, useCalendarStore } from './calendarStore';
import { convertResultCourseToEvent } from './utils';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& a': {
		color: `${theme.palette.text.primary}!important`,
		textDecoration: 'none!important'
	},
	'&  .fc-media-screen': {
		minHeight: '100%',
		width: '100%'
	},
	'& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th': {
		borderColor: `${theme.palette.divider}!important`
	},
	'&  .fc-scrollgrid-section > td': {
		border: 0
	},
	'& .fc-daygrid-day': {
		'&:last-child': {
			borderRight: 0
		}
	},
	'& .fc-col-header-cell': {
		borderWidth: '0 1px 0 1px',
		padding: '8px 0 0 0',
		'& .fc-col-header-cell-cushion': {
			color: theme.palette.text.secondary,
			fontWeight: 500,
			fontSize: 12,
			textTransform: 'uppercase'
		}
	},
	'& .fc-view ': {
		'& > .fc-scrollgrid': {
			border: 0
		}
	},
	'& .fc-daygrid-day.fc-day-today': {
		backgroundColor: 'transparent!important',
		'& .fc-daygrid-day-number': {
			borderRadius: '100%',
			backgroundColor: `${theme.palette.secondary.main}!important`,
			color: `${theme.palette.secondary.contrastText}!important`
		}
	},
	'& .fc-daygrid-day-top': {
		justifyContent: 'center',

		'& .fc-daygrid-day-number': {
			color: theme.palette.text.secondary,
			fontWeight: 500,
			fontSize: 12,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: 26,
			height: 26,
			margin: '4px 0',
			borderRadius: '50%',
			float: 'none',
			lineHeight: 1
		}
	},
	'& .fc-h-event': {
		background: 'initial'
	},
	'& .fc-event': {
		border: 0,
		padding: '0 ',
		fontSize: 12,
		margin: '0 6px 4px 6px!important'
	}
}));

/**
 * The calendar app.
 */
function CalendarApp() {
	const [events, results, selectedResultIndex] = useCalendarStore((state) => [
		state.events,
		state.results,
		state.selectedResultIndex
	]);
	const resultCourses = results[selectedResultIndex ?? 0]?.courses ?? [];
	const calendarRef = useRef<FullCalendar>(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [professorsSidebarOpen, setProfessorsSidebarOpen] = useState(!isMobile);
	const [coursesSidebarOpen, setCoursesSidebarOpen] = useState(!isMobile);
	const theme = useTheme();

	useEffect(() => {
		setProfessorsSidebarOpen(!isMobile);
		setCoursesSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		// Correct calendar dimentions after sidebar toggles
		setTimeout(() => {
			calendarRef.current?.getApi()?.updateSize();
		}, 300);
	}, [professorsSidebarOpen, coursesSidebarOpen]);

	function handleToggleCoursesSidebar() {
		setCoursesSidebarOpen(!coursesSidebarOpen);
	}

	function handleToggleProfessorsSidebar() {
		setProfessorsSidebarOpen(!professorsSidebarOpen);
	}

	console.log({ resultCourses, aa: resultCourses.map(convertResultCourseToEvent) });

	return (
		<Root
			header={
				<CalendarHeader
					onToggleCoursesSidebar={handleToggleCoursesSidebar}
					onToggleProfessorsSidebar={handleToggleProfessorsSidebar}
				/>
			}
			content={
				<FullCalendar
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					headerToolbar={false}
					initialView="timeGridWeek"
					locale="fa"
					allDayText="ساعت"
					direction={theme.direction}
					dayMaxEvents
					weekends
					events={resultCourses.map(convertResultCourseToEvent)}
					// eslint-disable-next-line react/no-unstable-nested-components
					eventContent={(eventInfo: EventContentArg & { event: IEvent }) => (
						<CalendarAppEventContent eventInfo={eventInfo} />
					)}
					ref={calendarRef}
				/>
			}
			leftSidebarContent={<CalendarAppProfessorsSidebar />}
			leftSidebarOpen={professorsSidebarOpen}
			leftSidebarOnClose={() => setProfessorsSidebarOpen(false)}
			leftSidebarWidth={280}
			rightSidebarContent={<CalendarAppCoursesSidebar />}
			rightSidebarOpen={coursesSidebarOpen}
			rightSidebarOnClose={() => setCoursesSidebarOpen(false)}
			rightSidebarWidth={280}
			scroll="content"
		/>
	);
}

export default CalendarApp;
