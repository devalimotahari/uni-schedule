import { EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { styled, useTheme } from '@mui/material/styles';
import { useRef } from 'react';
import PageTemplate from 'app/shared-components/PageTemplate';
import CalendarAppEventContent from './CalendarAppEventContent';
import CalendarHeader from './CalendarHeader';
import { IEvent, useCalendarStore } from './calendarStore';
import { convertResultCourseToEvent, weekDays } from '../../utils/utils';

const Root = styled(PageTemplate)(({ theme }) => ({
	'& a': {
		color: `${theme.palette.text.primary}!important`,
		textDecoration: 'none!important'
	},
	'&  .fc-media-screen': {
		minHeight: '100%',
		width: '100%'
	},
	'&  .fc-event-main': {
		overflow: 'auto'
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
	const theme = useTheme();

	return (
		<Root
			title="تقویم برنامه درسی"
			customFilters={<CalendarHeader />}
		>
			<div className="p-12 md:p-32">
				<FullCalendar
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					headerToolbar={false}
					initialView="timeGridWeek"
					locale="fa"
					dayHeaderFormat={(arg) => {
						return weekDays[new Date(arg.date.year, arg.date.month, arg.date.day).getDay()];
					}}
					allDayText="ساعت"
					direction={theme.direction}
					dayMaxEvents
					weekends
					initialDate={new Date(2024, 5, 2)}
					events={resultCourses.map(convertResultCourseToEvent)}
					// eslint-disable-next-line react/no-unstable-nested-components
					eventContent={(eventInfo: EventContentArg & { event: IEvent }) => (
						<CalendarAppEventContent eventInfo={eventInfo} />
					)}
					ref={calendarRef}
				/>
			</div>
		</Root>
	);
}

export default CalendarApp;
