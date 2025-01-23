import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventContentArg } from '@fullcalendar/core';
import { IEvent } from 'app/store/calendarStore';
import { memo, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import CalendarEventContent from './CalendarEventContent';
import { weekDays } from '../../utils/utils';

interface IProps {
	events: IEvent[];
}

function CalendarView({ events }: IProps) {
	const calendarRef = useRef<FullCalendar>(null);
	const theme = useTheme();

	return (
		<div className="w-full">
			<FullCalendar
				ref={calendarRef}
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
				events={events}
				// eslint-disable-next-line react/no-unstable-nested-components
				eventContent={(eventInfo: EventContentArg & { event: IEvent }) => (
					<CalendarEventContent eventInfo={eventInfo} />
				)}
			/>
		</div>
	);
}

export default memo(CalendarView);
