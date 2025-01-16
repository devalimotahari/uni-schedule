import { closeDialog, openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useAppDispatch } from 'app/store/hooks';
import { motion } from 'framer-motion';
import { groupBy } from 'lodash';
import { Fragment } from 'react';
import { Typography, Divider } from '@mui/material';
import { ICourse, useCalendarStore } from './calendarStore';
import CourseDialog from './dialogs/course/CourseDialog';
import { semisterColors } from './utils';

/**
 * The calendar app sidebar.
 */
function CalendarAppCoursesSidebar() {
	const [courses, deleteCourse] = useCalendarStore((state) => [state.courses, state.deleteCourse]);
	const sortedCourses = courses?.sort((a, b) => a.semester - b.semester) ?? [];
	const groupedBySemester = groupBy(sortedCourses, 'semester');

	const dispatch = useAppDispatch();

	const openFormDialog = (initialData?: ICourse) => {
		dispatch(
			openDialog({
				children: <CourseDialog initialData={initialData} />,
				props: {
					fullWidth: true,
					maxWidth: 'sm'
				}
			})
		);
	};

	const openDeleteDialog = (course: ICourse) => {
		dispatch(
			openDialog({
				children: (
					<>
						<DialogTitle>حذف درس</DialogTitle>
						<DialogContent>آیا از حذف {course.name} اطمینان دارید؟</DialogContent>
						<DialogActions>
							<Button
								color="secondary"
								variant="contained"
								onClick={() => {
									deleteCourse(course.id);
									dispatch(closeDialog());
								}}
							>
								بله
							</Button>
							<Button
								onClick={() => dispatch(closeDialog())}
								variant="text"
								color="error"
							>
								خیر
							</Button>
						</DialogActions>
					</>
				),
				props: {
					fullWidth: true,
					maxWidth: 'sm'
				}
			})
		);
	};
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
					onClick={() => openFormDialog()}
					className="rounded-lg"
					variant="outlined"
					size="small"
					color="info"
				>
					افزودن درس
				</Button>
			</Box>

			<List>
				{Object.entries(groupedBySemester).map(([semester, courses]) => (
					<Fragment key={semester}>
						<Typography className="mt-20">ترم {semester}</Typography>
						<Divider className="mb-10 mt-4" />
						{courses.map((course) => (
							<ListItem
								divider
								sx={(theme) => ({
									backgroundColor: semisterColors[course.semester],
									color: theme.palette.getContrastText(semisterColors[course.semester])
								})}
								className="rounded-md"
								key={course.id}
								secondaryAction={
									<>
										<IconButton
											onClick={() => openDeleteDialog(course)}
											color="inherit"
											aria-label="delete"
										>
											<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
										</IconButton>
										<IconButton
											onClick={() => openFormDialog(course)}
											color="inherit"
											aria-label="edit"
										>
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
								 ترم:
								${course.semester}
							`}
									secondaryTypographyProps={{
										className: 'opacity-80',
										color: 'inherit',
										fontSize: 12
									}}
								/>
							</ListItem>
						))}
					</Fragment>
				))}
			</List>
		</div>
	);
}

export default CalendarAppCoursesSidebar;
