import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { MobileTimePicker } from '@mui/x-date-pickers';
import { useAppDispatch } from 'app/store/hooks';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { validationMessages } from 'app/configs/validationMessages-i18n';
import { commonTimePickerProps, parseDateToTimeFormat, parseTimeFormatToDate } from 'src/app/utils/utils';
import { IFormDialogProps } from 'app/shared-components/PageTemplate';
import { IClassroom, ICourse, IMajor, IProfessor } from 'app/services/responseTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { queryKeys } from 'app/constants';
import { PostCreateCourse, PutUpdateCourse } from 'app/services/apiShortRequests';
import { ICreateCourse } from 'app/services/requestTypes';
import Dialog from '@mui/material/Dialog';
import _ from '../../../@lodash/@lodash';
import useGetMajors from '../../hooks/api/useGetMajors';
import { DeepPartial, DeepRequired } from '../../constants/types';
import useGetProfessors from '../../hooks/api/useGetProfessors';
import useGetClassrooms from '../../hooks/api/useGetClassrooms';

const schema = z.object({
	title: z.string({ required_error: validationMessages('required') }).min(1, validationMessages('required')),
	semester: z.coerce
		.number({ required_error: validationMessages('required') })
		.min(1, 'حداقل شماره ترم 1 می باشد.')
		.max(8, 'حداکثر شماره ترم 8 می باشد.'),
	units: z.coerce
		.number({ required_error: validationMessages('required') })
		.min(1, 'حداقل واحد 1 می باشد')
		.max(4, 'حداکثر واحد 4 می باشد'),
	duration: z.string({ required_error: validationMessages('required') }).min(1, validationMessages('required')),
	calculated_hours: z.coerce.number({ required_error: validationMessages('required') }),
	professors: z.array(
		z.object(
			{ id: z.coerce.number({ required_error: validationMessages('required') }) },
			{ required_error: validationMessages('required') }
		)
	),
	classroom: z.object(
		{ id: z.coerce.number({ required_error: validationMessages('required') }) },
		{ required_error: validationMessages('required') }
	),
	major: z.object(
		{ id: z.coerce.number({ required_error: validationMessages('required') }) },
		{ required_error: validationMessages('required') }
	)
});

type FormType = z.infer<typeof schema>;

const defaultValues: DeepPartial<FormType> = {
	professors: []
};

function CourseDialog({ onClose, initialData }: IFormDialogProps<ICourse>) {
	const dispatch = useAppDispatch();

	const qc = useQueryClient();
	const onSuccess = () => {
		dispatch(showMessage({ message: 'عملیات با موفقیت انجام شد.', variant: 'success' }));
		qc.invalidateQueries({
			queryKey: queryKeys.courses.list
		});
		onClose();
	};
	const onError = () => {
		dispatch(showMessage({ message: 'مشکلی در انجام عملیات رخ داده است.', variant: 'error' }));
	};

	const { mutate: createMutate, isPending: createPending } = useMutation({
		mutationFn: PostCreateCourse,
		onError,
		onSuccess
	});

	const { mutate: updateMutate, isPending: updatePending } = useMutation({
		mutationFn: PutUpdateCourse,
		onError,
		onSuccess
	});

	const isLoading = createPending || updatePending;

	const { control, handleSubmit } = useForm<FormType>({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: _.defaults(initialData, defaultValues)
	});

	const onSubmit = (values: DeepRequired<FormType>) => {
		const data: ICreateCourse = {
			title: values.title,
			units: values.units,
			duration: values.duration,
			semester: values.semester,
			calculated_hours: values.calculated_hours,
			major_id: values.major.id,
			classroom_id: values.classroom.id,
			professor_ids: values.professors.map((p) => p.id)
		};

		if (initialData?.id) {
			updateMutate({
				id: initialData.id,
				...data
			});
		} else {
			createMutate(data);
		}
	};

	const { data: majors, isLoading: majorsLoading } = useGetMajors();
	const { data: professors, isLoading: professorsLoading } = useGetProfessors();
	const { data: classrooms, isLoading: classroomsLoading } = useGetClassrooms();

	return (
		<Dialog
			open
			onClose={onClose}
			fullWidth
			maxWidth="md"
			onSubmit={handleSubmit(onSubmit)}
			component="form"
		>
			<DialogTitle>{initialData ? 'ویرایش درس' : 'افزودن درس'}</DialogTitle>
			<DialogContent className="flex flex-col gap-20 justify-center items-start !py-16">
				<Controller
					control={control}
					name="title"
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							fullWidth
							autoFocus
							label="عنوان"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>
					)}
				/>
				<div className="w-full flex items-center gap-10">
					<Controller
						control={control}
						name="units"
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								fullWidth
								type="number"
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
							<TextField
								{...field}
								fullWidth
								type="number"
								label="شماره ترم"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						)}
					/>
				</div>
				<div className="w-full flex items-center gap-10">
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
						name="calculated_hours"
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								fullWidth
								type="number"
								label="میزان ساعت تدریس قابل محاسبه برای استاد"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						)}
					/>
				</div>
				<Controller
					control={control}
					name="major"
					render={({ field, fieldState }) => (
						<Autocomplete<IMajor>
							{...field}
							fullWidth
							value={field.value as IMajor}
							options={majors ?? []}
							getOptionKey={(o) => o.id}
							isOptionEqualToValue={(o, v) => o.id === v.id}
							loading={majorsLoading}
							getOptionLabel={(o) => `${o.name}(${o.semesters})`}
							onChange={(e, v) => field.onChange(v)}
							renderInput={(params) => (
								<TextField
									{...params}
									label="رشته‌ی درسی"
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
					)}
				/>
				<Controller
					control={control}
					name="classroom"
					render={({ field, fieldState }) => (
						<Autocomplete<IClassroom>
							{...field}
							fullWidth
							value={field.value as IClassroom}
							getOptionKey={(o) => o.id}
							isOptionEqualToValue={(o, v) => o.id === v.id}
							options={classrooms ?? []}
							loading={classroomsLoading}
							getOptionLabel={(o) => `${o.name}(${o.available_classes})`}
							onChange={(e, v) => field.onChange(v)}
							renderInput={(params) => (
								<TextField
									{...params}
									label="محل برگزاری کلاس"
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
					)}
				/>
				<Controller
					control={control}
					name="professors"
					render={({ field, fieldState }) => (
						<Autocomplete<IProfessor, true>
							{...field}
							fullWidth
							multiple
							filterSelectedOptions
							getOptionKey={(o) => o.id}
							isOptionEqualToValue={(o, v) => o.id === v.id}
							value={field.value as IProfessor[]}
							options={professors ?? []}
							loading={professorsLoading}
							getOptionLabel={(o) => `${o.full_name}(${o.major?.name})`}
							onChange={(e, v) => field.onChange(v)}
							renderInput={(params) => (
								<TextField
									{...params}
									label="استادها"
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
					)}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					color="error"
					variant="text"
					disabled={isLoading}
					onClick={onClose}
				>
					لغو
				</Button>
				<Button
					type="submit"
					color="secondary"
					variant="contained"
					disabled={isLoading}
				>
					ذخیره
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CourseDialog;
