import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from '@lodash';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useMutation } from '@tanstack/react-query';
import { validationMessages } from 'app/configs/validationMessages-i18n';
import { i18nNamespaces } from 'app/constants';
import { PostAuthForgotPassword } from 'app/services/apiShortRequests';
import { useAppDispatch } from 'app/store/hooks';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import history from '../../../@history/@history';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().min(1, validationMessages('required')).email(validationMessages('email'))
});

type FormType = z.infer<typeof schema>;

function ForgotPasswordEmailForm() {
	const { t } = useTranslation(i18nNamespaces.pages.forgotPassword);

	const dispatch = useAppDispatch();

	const { control, formState, handleSubmit } = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			email: ''
		},
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	const { mutate, isPending } = useMutation({
		mutationFn: PostAuthForgotPassword,
		onSuccess: () => {
			dispatch(showMessage({ message: t(`sendEmailSuccessfully`), variant: 'success' }));
			history.push('/sign-in');
		}
	});

	function onSubmit(formData: FormType) {
		const { email } = formData;

		mutate({
			email
		});
	}

	return (
		<div className="w-full">
			<form
				name="forgotPasswordForm"
				noValidate
				className="mt-32 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					name="email"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							className="mb-24"
							inputProps={{ className: 'ltr' }}
							label={t('email')}
							autoFocus
							type="email"
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
					aria-label={t('continue')}
					disabled={_.isEmpty(dirtyFields) || !isValid || isPending}
					type="submit"
					size="large"
				>
					{t('continue')}
				</Button>
			</form>
		</div>
	);
}

export default ForgotPasswordEmailForm;
