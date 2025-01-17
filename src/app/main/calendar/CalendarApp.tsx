import { EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { styled, useTheme } from '@mui/material/styles';
import { useRef, useState } from 'react';
import { IEvent, useCalendarStore } from 'app/store/calendarStore';
import FuseLoading from '@fuse/core/FuseLoading';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import CalendarEventContent from './CalendarEventContent';
import { convertResultCourseToEvent, weekDays } from '../../utils/utils';
import useGetSolverResultById from '../../hooks/api/useGetSolverResultById';

const Root = styled('div')(({ theme }) => ({
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
		minWidth: 180,
		margin: '0 6px 4px 6px!important'
	}
}));

/**
 * The calendar app.
 */
function CalendarApp() {
	const [selectedResultId, setResultId] = useCalendarStore((state) => [
		state.selectedResultId,
		state.setSelectedResultId
	]);

	const { data: solverResult, isLoading } = useGetSolverResultById({ id: selectedResultId ?? undefined });

	const [resultIndex, setResultIndex] = useState<number>(0);

	const calendarRef = useRef<FullCalendar>(null);
	const theme = useTheme();

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!solverResult) {
		return (
			<div className="min-h-[80dvh] h-full w-full grid place-content-center">
				<Typography variant="h6">برنامه مورد نظر شما وجود ندارد!</Typography>
			</div>
		);
	}

	return (
		<Root className="w-full flex flex-col gap-44 p-12 md:p-32">
			<div className="w-full flex gap-5 items-center justify-between">
				<Typography>
					شما در حال مشاهده برنامه درسی
					{` ${solverResult.name} `}
					ایجاد شده در تاریخ
					{` ${new Date(solverResult.created_at).toLocaleString('fa-IR-u-nu-latn')} `}
					هستید
				</Typography>
				<Button
					onClick={() => {
						setResultId(null);
					}}
					variant="outlined"
					size="small"
					color="primary"
				>
					بازگشت به لیست
				</Button>
			</div>
			{solverResult.resualt.length > 1 && (
				<div className="w-full">
					<Autocomplete<{ label: string; value: number }>
						className="w-xs"
						value={{ label: `برنامه شماره ${resultIndex + 1}`, value: resultIndex }}
						options={
							solverResult.resualt.map((_, index) => ({
								label: `برنامه شماره ${index + 1}`,
								value: index
							})) ?? []
						}
						getOptionKey={(o) => o.value}
						isOptionEqualToValue={(o, v) => o.value === v.value}
						filterSelectedOptions
						getOptionLabel={(o) => o.label}
						onChange={(e, v) => setResultIndex(v.value)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="یکی از برنامه درسی‌های ساخته شده را انتخاب نمایید"
							/>
						)}
					/>
				</div>
			)}
			<div className="w-full overflow-auto">
				<div className="w-[4000rem] h-[80dvh]">
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
						events={solverResult.resualt[resultIndex]?.courses?.map(convertResultCourseToEvent) ?? []}
						// eslint-disable-next-line react/no-unstable-nested-components
						eventContent={(eventInfo: EventContentArg & { event: IEvent }) => (
							<CalendarEventContent eventInfo={eventInfo} />
						)}
						ref={calendarRef}
					/>
				</div>
			</div>
		</Root>
	);
}

export default CalendarApp;
