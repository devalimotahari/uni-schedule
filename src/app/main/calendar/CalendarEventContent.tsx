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
					<Typography>{eventInfo.event.extendedProps.desc}</Typography>
				</>
			}
		>
			<Box
				sx={{
					backgroundColor: eventInfo.event.backgroundColor,
					color: theme.palette.getContrastText(eventInfo.event.backgroundColor)
				}}
				className={clsx('flex flex-col items-center w-full rounded-4 px-8 py-2')}
			>
				<Box className="flex items-center w-full gap-8">
					<Typography className="text-12 font-semibold">{eventInfo.timeText}</Typography>
					<Typography className="text-12 px-4 truncate">{eventInfo.event.title}</Typography>
				</Box>
				<Typography
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
