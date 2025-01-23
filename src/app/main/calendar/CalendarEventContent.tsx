import { EventContentArg } from '@fullcalendar/core';
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { IEvent } from 'app/store/calendarStore';

type CalendarAppEventContentProps = {
	eventInfo: EventContentArg & { event: IEvent };
};

/**
 * The event content for the calendar app.
 */
function CalendarEventContent(props: CalendarAppEventContentProps) {
	const { eventInfo } = props;
	const theme = useTheme();

	return (
		<Tooltip
			placement="top"
			title={
				<>
					<Typography>{eventInfo.timeText}</Typography>
					<Typography>{eventInfo.event.title}</Typography>
					<Typography>{eventInfo.event.extendedProps.label}</Typography>
					<Typography fontWeight={800}>{eventInfo.event.extendedProps.desc}</Typography>
				</>
			}
		>
			<Box
				sx={{
					backgroundColor: eventInfo.event.backgroundColor,
					color: theme.palette.getContrastText(eventInfo.event.backgroundColor)
				}}
				className={clsx('relative flex flex-col items-center w-full rounded-4 px-8 py-2')}
			>
				{!!eventInfo.event.extendedProps.desc && (
					<span className="absolute top-0 right-0 bg-teal inline-block w-8 h-8 rounded-full" />
				)}
				<Typography className="text-12 font-semibold">{eventInfo.timeText}</Typography>
				<Typography className="text-12 px-4">{eventInfo.event.title}</Typography>
				<Typography
					variant="caption"
					className="w-full"
				>
					{eventInfo.event.extendedProps.label}
				</Typography>
				<Typography
					fontWeight={800}
					variant="caption"
					className="w-full"
				>
					{eventInfo.event.extendedProps.desc}
				</Typography>
			</Box>
		</Tooltip>
	);
}

export default CalendarEventContent;
