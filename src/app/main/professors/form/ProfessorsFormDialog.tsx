import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, FormHelperText } from '@mui/material';
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
import { IFormDialogProps } from 'app/shared-components/PageTemplate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { queryKeys } from 'app/constants';
import { PostCreateProfessor, PutUpdateProfessor } from 'app/services/apiShortRequests';
import { IMajor, IProfessor } from 'app/services/responseTypes';
import { validationMessages } from 'app/configs/validationMessages-i18n';
import Dialog from '@mui/material/Dialog';
import { ICreateProfessor } from 'app/services/requestTypes';
import { weekDays } from 'src/app/utils/utils';
import { DeepPartial, DeepRequired } from 'src/app/constants/types';
import _ from '@lodash';
import ProfessorDaysForm from './ProfessorDaysForm';
import useGetMajors from '../../../hooks/api/useGetMajors';

const schema = z.object({
	full_name: z.string({ required_error: validationMessages('required') }),
	major: z.object(
		{ id: z.coerce.number({ required_error: validationMessages('required') }) },
		{ required_error: validationMessages('required') }
	),
	min_hour: z.coerce.number().optional().nullable(),
	max_hour: z.coerce.number().optional().nullable(),
	preferred_days: z.array(z.coerce.number()).optional(),
	time_slots: z
		.array(
			z.object({
				day: z.number({ required_error: validationMessages('required') }),
				start_time: z
					.string({ required_error: validationMessages('required') })
					.length(5, 'لطفا زمان شروع را به درستی وارد نمایید'),
				end_time: z
					.string({ required_error: validationMessages('required') })
					.length(5, 'لطفا زمان پایان را به درستی وارد نمایید')
			}),
			{ required_error: validationMessages('required') }
		)
		.min(1, validationMessages('required'))
});

type FormType = z.infer<typeof schema>;

const defaultValues: DeepPartial<FormType> = {
	time_slots: [{ day: 0, start_time: '', end_time: '' }],
	preferred_days: []
};

function ProfessorsFormDialog({ onClose, initialData }: IFormDialogProps<IProfessor>) {
	const dispatch = useAppDispatch();

	const qc = useQueryClient();
	const onSuccess = () => {
		dispatch(showMessage({ message: 'عملیات با موفقیت انجام شد.', variant: 'success' }));
		qc.invalidateQueries({
			queryKey: queryKeys.professors.list
		});
		onClose();
	};
	const onError = () => {
		dispatch(showMessage({ message: 'مشکلی در انجام عملیات رخ داده است.', variant: 'error' }));
	};

	const { mutate: createMutate, isPending: createPending } = useMutation({
		mutationFn: PostCreateProfessor,
		onError,
		onSuccess
	});

	const { mutate: updateMutate, isPending: updatePending } = useMutation({
		mutationFn: PutUpdateProfessor,
		onError,
		onSuccess
	});

	const isLoading = createPending || updatePending;

	const { control, handleSubmit, watch } = useForm<FormType>({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: _.defaults(initialData, defaultValues)
	});

	const onSubmit = (values: DeepRequired<FormType>) => {
		const data: ICreateProfessor = {
			full_name: values.full_name,
			major_id: values.major?.id as unknown as number,
			max_hour: values.max_hour,
			min_hour: values.min_hour,
			preferred_days: values.preferred_days,
			time_slots: values.time_slots
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

	const days = watch('time_slots') ?? [];
	const selectedDays = days.map((day) => day.day) ?? [];

	return (
		<Dialog
			open
			onClose={onClose}
			fullWidth
			maxWidth="md"
			onSubmit={handleSubmit(onSubmit)}
			component="form"
		>
			<DialogTitle>{initialData ? 'ویرایش استاد' : 'افزودن استاد'}</DialogTitle>
			<DialogContent className="flex flex-col gap-20 justify-center items-start !py-16">
				<Controller
					control={control}
					name="full_name"
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							fullWidth
							autoFocus
							label="نام و نام خانوادگی"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>
					)}
				/>
				<div className="w-full flex items-center gap-10">
					<Controller
						control={control}
						name="min_hour"
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								fullWidth
								label="حداقل ساعت مجاز تدریس"
								type="number"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						)}
					/>
					<Controller
						control={control}
						name="max_hour"
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								fullWidth
								label="حداکثر ساعت مجاز تدریس"
								type="number"
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
							autoHighlight
							value={field.value as IMajor}
							options={majors ?? []}
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
				<ProfessorDaysForm formControl={control} />
				<Controller
					control={control}
					name="preferred_days"
					render={({ field, fieldState }) => (
						<FormControl fullWidth>
							<InputLabel id="prefer-days-label">روز های ترجیحی</InputLabel>
							<Select
								{...field}
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

export default ProfessorsFormDialog;
