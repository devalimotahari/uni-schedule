import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from '@lodash';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useMutation } from '@tanstack/react-query';
import { validationMessages } from 'app/configs/validationMessages-i18n';
import { i18nNamespaces, RegExps } from 'app/constants';
import { PostAuthForgotPassword } from 'app/services/apiShortRequests';
import { useAppDispatch } from 'app/store/hooks';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import history from '../../../@history/@history';

/**
 * Form Validation Schema
 */
const schema = z
	.object({
		password: z
			.string()
			.min(1, validationMessages('required'))
			.regex(RegExps.password, validationMessages('password')),
		passwordConfirm: z.string().min(1, validationMessages('required'))
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: validationMessages('passwordConfirm'),
		path: ['passwordConfirm']
	});

type FormType = z.infer<typeof schema>;

function ForgotPasswordResetForm() {
	const { t } = useTranslation(i18nNamespaces.pages.forgotPassword);

	const [searchParams] = useSearchParams();

	const dispatch = useAppDispatch();

	const { control, formState, handleSubmit } = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			password: '',
			passwordConfirm: ''
		},
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	const { mutate, isPending } = useMutation({
		mutationFn: PostAuthForgotPassword,
		onSuccess: () => {
			dispatch(showMessage({ message: t(`resetPasswordSuccessfully`), variant: 'success' }));
			history.push('/sign-in');
		}
	});

	function onSubmit(formData: FormType) {
		const { password } = formData;

		mutate({
			newPassword: password,
			hash: searchParams.get('hash')
		});
	}

	return (
		<div className="w-full">
			<form
				name="resetPasswordForm"
				noValidate
				className="mt-32 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					name="password"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							className="mb-24"
							label={t('password')}
							autoFocus
							type="password"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>
				<Controller
					name="passwordConfirm"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							className="mb-24"
							label={t('passwordConfirm')}
							type="password"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Button
					variant="contained"
					color="secondary"
					className="mt-16 w-full"
					aria-label={t('resetPassword')}
					disabled={_.isEmpty(dirtyFields) || !isValid || isPending}
					type="submit"
					size="large"
				>
					{t('resetPassword')}
				</Button>
			</form>
		</div>
	);
}

export default ForgotPasswordResetForm;
