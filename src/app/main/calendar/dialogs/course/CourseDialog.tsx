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
import { MobileTimePicker } from '@mui/x-date-pickers';
import { useAppDispatch } from 'app/store/hooks';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ICourse, useCalendarStore } from '../../calendarStore';
import { commonTimePickerProps, parseDateToTimeFormat, parseTimeFormatToDate } from '../../../../utils/utils';

const schema = z.object({
	name: z.string({ required_error: 'لطفا عنوان درس را وارد نمایید' }).min(1, 'لطفا عنوان درس را وارد نمایید'),
	semester: z.coerce
		.number({ required_error: 'لطفا شماره ترم را وارد نمایید.' })
		.min(1, 'حداقل شماره ترم 1 می باشد.')
		.max(8, 'حداکثر شماره ترم 8 می باشد.'),
	unit: z.coerce
		.number({ required_error: 'لطفا تعداد واحد را وارد نمایید.' })
		.min(1, 'حداقل واحد 1 می باشد')
		.max(4, 'حداکثر واحد 4 می باشد'),
	duration: z.string({ required_error: 'لطفا مدت زمان را وارد نمایید.' }).min(1, 'لطفا مدت زمان را وارد نمایید.'),
	professors: z.array(z.string())
});

type FormType = z.infer<typeof schema>;

interface IProps {
	initialData?: ICourse;
}

function CourseDialog({ initialData }: IProps) {
	const { control, handleSubmit } = useForm<FormType>({
		defaultValues: {
			name: initialData?.name,
			unit: initialData?.unit ?? 2,
			semester: initialData?.semester ?? 1,
			duration: initialData?.duration ?? '',
			professors: initialData?.professors ?? []
		},
		resolver: zodResolver(schema)
	});

	const [professors, addCourse, editCourse] = useCalendarStore((state) => [
		state.professors,
		state.addCourse,
		state.editCourse
	]);

	const dispatch = useAppDispatch();

	const isEdit = !!initialData?.id;

	const onClose = () => {
		dispatch(closeDialog());
	};

	const onSubmit = (values: FormType) => {
		if (isEdit) {
			editCourse(initialData.id, {
				...values,
				semester: +values.semester
			});
		} else {
			addCourse({
				...values,
				name: values.name ?? '',
				unit: values.unit ?? 2,
				duration: values.duration ?? '',
				professors: values.professors ?? [],
				semester: values.semester
			});
		}

		onClose();
	};

	return (
		<>
			<DialogTitle>{isEdit ? 'ویرایش' : 'ایجاد'} درس</DialogTitle>
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
								autoFocus
								size="small"
								label="عنوان"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						)}
					/>
					<Controller
						control={control}
						name="unit"
						rules={{ valueAsNumber: true }}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								fullWidth
								type="number"
								size="small"
								label="تعداد واحد"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						)}
					/>
					<Controller
						control={control}
						name="duration"
						render={({ field, fieldState }) => (
							<MobileTimePicker
								{...field}
								{...commonTimePickerProps(fieldState)}
								value={parseTimeFormatToDate(field.value)}
								onChange={(value) => field.onChange(parseDateToTimeFormat(value))}
								label="مدت زمان"
							/>
						)}
					/>
					<Controller
						control={control}
						name="semester"
						rules={{ valueAsNumber: true }}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								fullWidth
								type="number"
								size="small"
								label="شماره ترم"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						)}
					/>
					<Controller
						control={control}
						name="professors"
						render={({ field, fieldState }) => (
							<FormControl fullWidth>
								<InputLabel id="professors-label">استاد ها</InputLabel>
								<Select
									{...field}
									size="small"
									label="استاد ها"
									multiple
									error={!!fieldState.error}
									labelId="professors-label"
								>
									{professors.map((prof) => (
										<MenuItem
											value={prof.id}
											key={prof.id}
											className="space-x-12"
										>
											<span>{prof.name}</span>
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

export default CourseDialog;
