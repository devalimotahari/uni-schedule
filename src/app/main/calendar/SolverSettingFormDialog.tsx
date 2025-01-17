import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { validationMessages } from 'app/configs/validationMessages-i18n';
import { queryKeys } from 'app/constants';
import { useAppDispatch } from 'app/store/hooks';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { IFormDialogProps } from 'app/shared-components/PageTemplate';
import { ISolverResult } from 'app/services/responseTypes';
import { PostSolve } from 'app/services/apiShortRequests';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';
import { useCalendarStore } from 'app/store/calendarStore';
import { AxiosResponse } from 'axios';

const schema = z.object({
	classroom_limitation: z.coerce.boolean({ required_error: validationMessages('required') }).default(true),
	professor_min_max_time_limitation: z.coerce
		.boolean({ required_error: validationMessages('required') })
		.default(true),
	solver_resualt_name: z.string({ required_error: validationMessages('required') }),
	number_of_solutions: z.coerce
		.number({ required_error: validationMessages('required') })
		.min(1, validationMessages('minNum', { value: 1 }))
		.max(20, validationMessages('maxNum', { value: 20 }))
});

type FormType = z.infer<typeof schema>;

function SolverSettingFormDialog({ onClose }: IFormDialogProps<ISolverResult>) {
	const dispatch = useAppDispatch();
	const setResultId = useCalendarStore((s) => s.setSelectedResultId);

	const qc = useQueryClient();
	const onSuccess = (res: AxiosResponse<{ solver_resualt_history: { id: number } }>) => {
		dispatch(showMessage({ message: 'عملیات با موفقیت انجام شد.', variant: 'success' }));
		qc.invalidateQueries({
			queryKey: queryKeys.solver.results
		});
		setResultId(res.data.solver_resualt_history.id);
		onClose();
	};
	const onError = () => {
		dispatch(showMessage({ message: 'مشکلی در انجام عملیات رخ داده است.', variant: 'error' }));
	};

	const { mutate: solveMutate, isPending: createPending } = useMutation({
		mutationFn: PostSolve,
		onError,
		onSuccess
	});

	const isLoading = createPending;

	const { control, handleSubmit } = useForm<FormType>({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			solver_resualt_name: '',
			number_of_solutions: 1,
			classroom_limitation: true,
			professor_min_max_time_limitation: true
		}
	});

	const onSubmit = (values: Required<FormType>) => {
		dispatch(
			showMessage({ message: 'این عملیات ممکن است چند دقیقه طول بکشد. لطفا منتظر بمانید.', variant: 'info' })
		);

		solveMutate({
			...values
		});
	};

	return (
		<Dialog
			open
			onClose={onClose}
			fullWidth
			maxWidth="xs"
			onSubmit={handleSubmit(onSubmit)}
			component="form"
		>
			<DialogTitle />
			<DialogContent className="flex flex-col gap-20 justify-center items-start !py-16">
				<Controller
					control={control}
					name="solver_resualt_name"
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							fullWidth
							label="عنوان"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>
					)}
				/>
				<Controller
					control={control}
					name="number_of_solutions"
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							fullWidth
							label="تعداد پاسخ‌های مورد انتظار"
							type="number"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>
					)}
				/>
				<Controller
					control={control}
					name="professor_min_max_time_limitation"
					render={({ field }) => (
						<FormControlLabel
							{...field}
							control={<Checkbox defaultChecked={field.value} />}
							label="اعمال محدودیت حداقل و حداکثر ساعات مجاز تدریس استاد"
						/>
					)}
				/>
				<Controller
					control={control}
					name="classroom_limitation"
					render={({ field }) => (
						<FormControlLabel
							{...field}
							control={<Checkbox defaultChecked={field.value} />}
							label="اعمال محدودیت تعداد کلاس‌ها"
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
					شروع پردازش
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default SolverSettingFormDialog;
