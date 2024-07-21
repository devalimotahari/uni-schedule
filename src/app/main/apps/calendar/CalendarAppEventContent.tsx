import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { EventContentArg } from '@fullcalendar/core';

type CalendarAppEventContentProps = {
	eventInfo: EventContentArg & { event: Event };
};

/**
 * The event content for the calendar app.
 */
function CalendarAppEventContent(props: CalendarAppEventContentProps) {
	const { eventInfo } = props;
	const theme = useTheme();

	return (
		<Box
			sx={{
				backgroundColor: eventInfo.event.backgroundColor,
				color: theme.palette.getContrastText(eventInfo.event.backgroundColor)
			}}
			className={clsx('flex flex-col items-center w-full rounded-4 px-8 py-2 h-22 text-white')}
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
	);
}

export default CalendarAppEventContent;
