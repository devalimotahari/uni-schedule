import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useAppDispatch } from 'app/store/hooks';
import {
	DateSelectArg,
	DatesSetArg,
	EventAddArg,
	EventChangeArg,
	EventClickArg,
	EventContentArg,
	EventDropArg,
	EventRemoveArg
} from '@fullcalendar/core';
import FuseLoading from '@fuse/core/FuseLoading';
import CalendarAppCoursesSidebar from './CalendarAppCoursesSidebar';
import CalendarHeader from './CalendarHeader';
import CalendarAppProfessorsSidebar from './CalendarAppProfessorsSidebar';
import CalendarAppEventContent from './CalendarAppEventContent';
import { useCalendarStore } from './calendarStore';

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
	const [currentDate, setCurrentDate] = useState<DatesSetArg>();
	const dispatch = useAppDispatch();
	const isLoading = false;
	const { events } = useCalendarStore();
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
	}, [professorsSidebarOpen]);

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		// dispatch(openNewEventDialog(selectInfo));
	};

	const handleEventDrop = (eventDropInfo: EventDropArg): void => {
		const { id, title, allDay, start, end, extendedProps } = eventDropInfo.event;
		/* updateEvent({
			id,
			title,
			allDay,
			start: start?.toISOString() ?? '',
			end: end?.toISOString() ?? '',
			extendedProps
		}); */
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		clickInfo.jsEvent.preventDefault();
		// dispatch(openEditEventDialog(clickInfo));
	};

	const handleDates = (rangeInfo: DatesSetArg) => {
		setCurrentDate(rangeInfo);
	};

	const handleEventAdd = (addInfo: EventAddArg) => {
		// eslint-disable-next-line no-console
		console.log(calendarRef.current.getApi().view);
		console.info(addInfo);
	};

	const handleEventChange = (changeInfo: EventChangeArg) => {
		// eslint-disable-next-line no-console
		console.info(changeInfo);
	};

	const handleEventRemove = (removeInfo: EventRemoveArg) => {
		// eslint-disable-next-line no-console
		console.info(removeInfo);
	};

	function handleToggleCoursesSidebar() {
		setCoursesSidebarOpen(!coursesSidebarOpen);
	}

	function handleToggleProfessorsSidebar() {
		setProfessorsSidebarOpen(!professorsSidebarOpen);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<>
			<Root
				header={
					<CalendarHeader
						calendarRef={calendarRef}
						currentDate={currentDate}
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
						editable
						direction={theme.direction}
						selectable
						selectMirror
						dayMaxEvents
						weekends
						datesSet={handleDates}
						select={handleDateSelect}
						events={events}
						// eslint-disable-next-line react/no-unstable-nested-components
						eventContent={(eventInfo: EventContentArg & { event: Event }) => (
							<CalendarAppEventContent eventInfo={eventInfo} />
						)}
						eventClick={handleEventClick}
						eventAdd={handleEventAdd}
						eventChange={handleEventChange}
						eventRemove={handleEventRemove}
						eventDrop={handleEventDrop}
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
			{/* <EventDialog /> */}
		</>
	);
}

export default CalendarApp;
