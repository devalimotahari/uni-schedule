import { validationMessages } from 'app/configs/validationMessages-i18n';
import { i18nNamespaces } from 'app/constants';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import _ from '@lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import useJwtAuth from '../../auth/services/jwt/useJwtAuth';

/**
 * Form Validation Schema
 */
const schema = z
	.object({
		username: z.string().min(1, validationMessages('required')),
		password: z.string().min(1, validationMessages('min', { length: 1 })),
		passwordConfirm: z.string().min(1, validationMessages('min', { length: 1 }))
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: validationMessages('passwordConfirm'),
		path: ['passwordConfirm']
	});

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
	username: '',
	password: '',
	passwordConfirm: ''
};

function SignUpForm() {
	const { t } = useTranslation(i18nNamespaces.pages.signUp);

	const { signUp, isLoading } = useJwtAuth();

	const { control, formState, handleSubmit } = useForm<FormType>({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues
	});

	const { isValid, dirtyFields } = formState;

	function onSubmit(formData: FormType) {
		const { username, password } = formData;
		signUp({
			password,
			username
		});
	}

	return (
		<form
			name="registerForm"
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
						label={t('username')}
						type="text"
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
				className="mt-24 w-full"
				aria-label={t('Register')}
				disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
				type="submit"
				size="large"
			>
				{t('signUp')}
			</Button>
		</form>
	);
}

export default SignUpForm;
