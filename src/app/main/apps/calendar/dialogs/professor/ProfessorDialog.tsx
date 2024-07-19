import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useAppDispatch } from 'app/store/hooks';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { IProfessor, useCalendarStore } from '../../calendarStore';
import { weekDays } from '../../utils';
import ProfessorDaysForm from './ProfessorDaysForm';

const schema = z.object({
	name: z.string({ required_error: 'لطفا نام را وارد نمایید' }).min(1, 'لطفا نام را وارد نمایید'),
	preferDays: z.array(z.number()).optional(),
	days: z.array(
		z.object({
			day: z.number(),
			startTime: z.string().length(5, 'لطفا زمان شروع را به درستی وارد نمایید'),
			endTime: z.string().length(5, 'لطفا زمان پایان را به درستی وارد نمایید')
		})
	)
});

type FormType = z.infer<typeof schema>;

interface IProps {
	initialData?: IProfessor;
}

function ProfessorDialog({ initialData }: IProps) {
	const { control, handleSubmit, watch } = useForm<FormType>({
		defaultValues: {
			name: initialData?.name,
			preferDays: initialData?.preferDays ?? [],
			days: initialData?.days ?? [{ day: 0, startTime: '', endTime: '' }]
		},
		resolver: zodResolver(schema)
	});

	const [addProfessor, editProfessor] = useCalendarStore((state) => [state.addProfessor, state.editProfessor]);

	const dispatch = useAppDispatch();

	const isEdit = !!initialData?.id;

	const onClose = () => {
		dispatch(closeDialog());
	};

	const onSubmit = (values: IProfessor) => {
		if (isEdit) {
			editProfessor(initialData.id, values);
		} else {
			addProfessor(values);
		}

		onClose();
	};

	const days = watch('days') ?? [];
	const selectedDays = days.map((day) => day.day) ?? [];

	return (
		<>
			<DialogTitle>{isEdit ? 'ویرایش' : 'ایجاد'} استاد</DialogTitle>
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
			>
				<DialogContent className="flex flex-col gap-20 justify-center items-start">
					<Controller
						control={control}
						name="name"
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								fullWidth
								size="small"
								label="نام و نام خانوادگی"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						)}
					/>
					<ProfessorDaysForm formControl={control} />
					<Controller
						control={control}
						name="preferDays"
						render={({ field, fieldState }) => (
							<FormControl fullWidth>
								<InputLabel id="prefer-days-label">روز های ترجیحی</InputLabel>
								<Select
									{...field}
									size="small"
									label="روز های ترجیحی"
									multiple
									error={!!fieldState.error}
									labelId="prefer-days-label"
								>
									{[...new Set(selectedDays)].map((day) => (
										<MenuItem
											value={day}
											key={day}
											className="space-x-12"
										>
											<span>{weekDays[day]}</span>
										</MenuItem>
									))}
								</Select>
								<FormHelperText error={!!fieldState.error}>{fieldState.error?.message}</FormHelperText>
							</FormControl>
						)}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						color="secondary"
						variant="contained"
						type="submit"
					>
						ذخیره
					</Button>
					<Button
						variant="text"
						color="error"
						onClick={onClose}
					>
						لغو
					</Button>
				</DialogActions>
			</Box>
		</>
	);
}

export default ProfessorDialog;
