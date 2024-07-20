import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { selectMainTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { useMutation } from '@tanstack/react-query';
import { PostCalculate } from 'app/services/apiShortRequests';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FullCalendar from '@fullcalendar/react';
import { DatesSetArg } from '@fullcalendar/core';
import { MutableRefObject } from 'react';
import { useSelector } from 'react-redux';
import { useCalendarStore } from './calendarStore';

type CalendarHeaderProps = {
	calendarRef: MutableRefObject<FullCalendar | null>;
	currentDate: DatesSetArg;
	onToggleCoursesSidebar: () => void;
	onToggleProfessorsSidebar: () => void;
};

/**
 * The calendar header.
 */
function CalendarHeader(props: CalendarHeaderProps) {
	const { calendarRef, currentDate, onToggleCoursesSidebar, onToggleProfessorsSidebar } = props;

	const mainTheme = useSelector(selectMainTheme);
	const calendarApi = () => calendarRef.current.getApi();

	const [professors, courses] = useCalendarStore((state) => [state.professors, state.courses]);

	const { mutate: calculateMutate, isPending } = useMutation({
		mutationFn: PostCalculate,
		onSuccess: (res) => {
			console.log({ res });
		}
	});

	const sendDataToCalculate = () => {
		calculateMutate({
			settings: {},
			data: {
				professors: professors.map((prof) => ({
					id: prof.id,
					name: prof.name,
					days: prof.days.map((d) => `${d.day}:${d.startTime.replace(/:/g, '')}:${d.startTime.replace(/:/g, '')}`),
					pref_days: prof.preferDays
				})),
				courses: courses.map((course) => ({
					id: course.id,
					name: course.name,
					semister: course.semester,
					units: course.unit,
					duration: course.duration.replace(/:/g, ''),
					professors: course.professors
				}))
			}
		});
	};

	return (
		<div className="flex flex-col md:flex-row w-full p-12 justify-between z-10 container">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<IconButton
						onClick={() => onToggleProfessorsSidebar()}
						aria-label="open right sidebar"
						size="small"
					>
						<FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
					</IconButton>

					<Typography className="hidden sm:flex text-2xl font-semibold tracking-tight whitespace-nowrap mx-16">
						{currentDate?.view.title}
					</Typography>
				</div>

				<div className="flex items-center">
					<Tooltip title="Previous">
						<IconButton
							aria-label="Previous"
							onClick={() => calendarApi().prev()}
						>
							<FuseSvgIcon size={20}>
								{mainTheme.direction === 'ltr'
									? 'heroicons-solid:chevron-left'
									: 'heroicons-solid:chevron-right'}
							</FuseSvgIcon>
						</IconButton>
					</Tooltip>
					<Tooltip title="Next">
						<IconButton
							aria-label="Next"
							onClick={() => calendarApi().next()}
						>
							<FuseSvgIcon size={20}>
								{mainTheme.direction === 'ltr'
									? 'heroicons-solid:chevron-right'
									: 'heroicons-solid:chevron-left'}
							</FuseSvgIcon>
						</IconButton>
					</Tooltip>

					<Tooltip title="Today">
						<div>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1, transition: { delay: 0.3 } }}
							>
								<IconButton
									aria-label="today"
									onClick={() => calendarApi().today()}
									size="large"
								>
									<FuseSvgIcon>heroicons-outline:calendar</FuseSvgIcon>
								</IconButton>
							</motion.div>
						</div>
					</Tooltip>
				</div>
				<Button
					onClick={sendDataToCalculate}
					disabled={professors.length === 0 || courses.length === 0 || isPending}
					variant="contained"
					color="secondary"
					className="rounded-lg"
				>
					شروع محاسبه برنامه
				</Button>
			</div>

			<motion.div
				className="flex items-center justify-end md:justify-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.3 } }}
			>
				<IconButton
					onClick={() => onToggleCoursesSidebar()}
					aria-label="open left sidebar"
					size="small"
				>
					<FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
				</IconButton>
			</motion.div>
		</div>
	);
}

export default CalendarHeader;
