import { zodResolver } from '@hookform/resolvers/zod';
import _ from '@lodash';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { validationMessages } from 'app/configs/validationMessages-i18n';
import { i18nNamespaces } from 'app/constants';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import useJwtAuth from '../../auth/services/jwt/useJwtAuth';

/**
 * Form Validation Schema
 */
const schema = z.object({
	username: z.string().min(1, validationMessages('required')),
	password: z.string().min(1, validationMessages('min', { length: 10 }))
});

type FormType = z.infer<typeof schema>;

function SignInForm() {
	const { t } = useTranslation(i18nNamespaces.pages.signIn);
	const { signIn, isLoading } = useJwtAuth();

	const { control, formState, handleSubmit } = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			username: '',
			password: ''
		},
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	function onSubmit(formData: FormType) {
		const { username, password } = formData;

		signIn?.({
			username,
			password
		});
	}

	return (
		<div className="w-full">
			<form
				name="loginForm"
				noValidate
				className="mt-32 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					name="username"
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

				<Controller
					name="password"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							className="mb-24"
							inputProps={{ className: 'ltr' }}
							label={t('password')}
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
					aria-label={t('signIn')}
					disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
					type="submit"
					size="large"
				>
					{t('signIn')}
				</Button>
			</form>
		</div>
	);
}

export default SignInForm;
