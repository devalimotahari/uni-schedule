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
import { IProfessor, useCalendarStore } from './calendarStore';
import ProfessorDialog from './dialogs/professor/ProfessorDialog';
import { weekDays } from './utils';

const getDayText = (day: number): string => {
	return weekDays[day];
};

/**
 * The calendar app sidebar.
 */
function CalendarAppProfessorsSidebar() {
	const [professors, deleteProfessor] = useCalendarStore((state) => [state.professors, state.deleteProfessor]);
	const dispatch = useAppDispatch();

	const openFormDialog = (initialData?: IProfessor) => {
		dispatch(
			openDialog({
				children: <ProfessorDialog initialData={initialData} />,
				props: {
					fullWidth: true,
					maxWidth: 'sm'
				}
			})
		);
	};

	const openDeleteDialog = (professor: IProfessor) => {
		dispatch(
			openDialog({
				children: (
					<>
						<DialogTitle>حذف استاد</DialogTitle>
						<DialogContent>آیا از حذف {professor.name} اطمینان دارید؟</DialogContent>
						<DialogActions>
							<Button
								color="secondary"
								variant="contained"
								onClick={() => {
									deleteProfessor(professor.id);
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
				استاد ها
			</motion.span>

			<Box className="flex justify-center">
				<Button
					onClick={() => openFormDialog()}
					className="rounded-lg"
					variant="outlined"
					size="small"
					color="info"
				>
					افزودن استاد
				</Button>
			</Box>

			<List>
				{professors?.map((prof) => (
					<ListItem
						divider
						key={prof.id}
						secondaryAction={
							<>
								<IconButton
									onClick={() => openDeleteDialog(prof)}
									edge="start"
									aria-label="delete"
								>
									<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
								</IconButton>
								<IconButton
									onClick={() => openFormDialog(prof)}
									edge="end"
									aria-label="edit"
								>
									<FuseSvgIcon size={20}>heroicons-outline:pencil</FuseSvgIcon>
								</IconButton>
							</>
						}
					>
						<ListItemText
							primary={prof.name}
							primaryTypographyProps={{
								variant: 'subtitle2'
							}}
							secondary={prof.days
								.reduce((acc, day) => {
									if (!acc.includes(day.day)) {
										acc.push(day.day);
									}

									return acc;
								}, [] as Array<number>)
								.map((d) => getDayText(d))
								.join(', ')}
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

export default CalendarAppProfessorsSidebar;
