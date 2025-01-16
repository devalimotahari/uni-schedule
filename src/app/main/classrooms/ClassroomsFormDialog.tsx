import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid } from '@mui/material';
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
import { IClassroom } from 'app/services/responseTypes';
import { PostCreateClassroom, PutUpdateClassroom } from 'app/services/apiShortRequests';

const schema = z.object({
	name: z.string({ required_error: validationMessages('required') }),
	available_classes: z.coerce
		.number({ required_error: validationMessages('required') })
		.min(1, validationMessages('minNum', { value: 1 }))
});

type FormType = z.infer<typeof schema>;

function ClassroomsFormDialog({ onClose, initialData }: IFormDialogProps<IClassroom>) {
	const dispatch = useAppDispatch();

	const qc = useQueryClient();
	const onSuccess = () => {
		dispatch(showMessage({ message: 'عملیات با موفقیت انجام شد.', variant: 'success' }));
		qc.invalidateQueries({
			queryKey: queryKeys.classrooms.list
		});
		onClose();
	};
	const onError = () => {
		dispatch(showMessage({ message: 'مشکلی در انجام عملیات رخ داده است.', variant: 'error' }));
	};

	const { mutate: createMutate, isPending: createPending } = useMutation({
		mutationFn: PostCreateClassroom,
		onError,
		onSuccess
	});

	const { mutate: updateMutate, isPending: updatePending } = useMutation({
		mutationFn: PutUpdateClassroom,
		onError,
		onSuccess
	});

	const isLoading = createPending || updatePending;

	const { control, handleSubmit } = useForm<FormType>({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			name: initialData?.name ?? '',
			available_classes: initialData?.available_classes ?? undefined
		}
	});

	const onSubmit = (values: Required<FormType>) => {
		if (initialData?.id) {
			updateMutate({
				...values,
				id: initialData.id
			});
		} else {
			createMutate({
				...values
			});
		}
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
			<DialogTitle>{initialData ? 'ویرایش محل مجموعه کلاس' : 'ایجاد محل مجموعه کلاس'}</DialogTitle>
			<DialogContent className="!py-16">
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						xs={12}
					>
						<Controller
							control={control}
							name="name"
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
					</Grid>

					<Grid
						item
						xs={12}
					>
						<Controller
							control={control}
							name="available_classes"
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									fullWidth
									label="تعداد کلاس‌ها"
									type="number"
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
					</Grid>
				</Grid>
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

export default ClassroomsFormDialog;
