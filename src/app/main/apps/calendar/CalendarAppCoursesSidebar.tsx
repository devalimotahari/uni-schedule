import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { motion } from 'framer-motion';
import { useCalendarStore } from './calendarStore';

/**
 * The calendar app sidebar.
 */
function CalendarAppCoursesSidebar() {
	const { courses } = useCalendarStore();

	return (
		<div className="flex flex-col flex-auto min-h-full py-16 px-12">
			<motion.span
				initial={{ x: -20 }}
				animate={{ x: 0, transition: { delay: 0.2 } }}
				className="pb-24 text-4xl font-extrabold tracking-tight"
			>
				درس ها
			</motion.span>

			<Box className="flex justify-center">
				<Button
					className="rounded-lg"
					variant="outlined"
					size="small"
					color="info"
				>
					افزودن درس
				</Button>
			</Box>

			<List>
				{courses?.map((course) => (
					<ListItem
						divider
						key={course.id}
						secondaryAction={
							<>
								<IconButton aria-label="delete">
									<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
								</IconButton>
								<IconButton aria-label="edit">
									<FuseSvgIcon size={20}>heroicons-outline:pencil</FuseSvgIcon>
								</IconButton>
							</>
						}
					>
						<ListItemText
							primary={course.name}
							primaryTypographyProps={{
								variant: 'subtitle2'
							}}
							secondary={`
								واحد: 
								${course.unit}
								 -
								 نیمسال:
								${course.semester}
							`}
							secondaryTypographyProps={{
								variant: 'caption'
							}}
						/>
					</ListItem>
				))}
			</List>
		</div>
	);
}

export default CalendarAppCoursesSidebar;
