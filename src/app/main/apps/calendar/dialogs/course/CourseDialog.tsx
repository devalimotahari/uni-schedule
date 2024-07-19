import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useAppDispatch } from 'app/store/hooks';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ICourse, useCalendarStore } from '../../calendarStore';

const schema = z.object({
	name: z.string({ required_error: 'لطفا عنوان درس را وارد نمایید' }).min(1, 'لطفا عنوان درس را وارد نمایید'),
	semester: z
		.string({ required_error: 'لطفا وضعیت نیمسال را وارد نمایید.' })
		.min(1, 'لطفا وضعیت نیمسال را وارد نمایید.'),
	unit: z
		.number({ required_error: 'لطفا تعداد واحد را وارد نمایید.' })
		.min(1, 'حداقل واحد 1 می باشد')
		.max(4, 'حداکثر واحد 4 می باشد'),
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
			semester: initialData?.semester?.toString() ?? '1',
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
				professors: values.professors ?? [],
				semester: +values.semester
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
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								fullWidth
								size="small"
								label="تعداد واحد"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						)}
					/>
					<Controller
						control={control}
						name="semester"
						render={({ field, fieldState }) => (
							<FormControl>
								<FormLabel id="semester-label">نیمسال</FormLabel>
								<RadioGroup
									{...field}
									aria-labelledby="semester-label"
									defaultValue={1}
									className="flex flex-row gap-10"
								>
									<FormControlLabel
										value={1}
										control={<Radio />}
										label="اول"
									/>
									<FormControlLabel
										value={2}
										control={<Radio />}
										label="دوم"
									/>
								</RadioGroup>
								<FormHelperText error={!!fieldState.error}>{fieldState.error?.message}</FormHelperText>
							</FormControl>
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
