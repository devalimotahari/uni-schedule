import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from '@lodash';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { validationMessages } from 'app/configs/validationMessages-i18n';
import { i18nNamespaces, RegExps } from 'app/constants';
import { useAppDispatch } from 'app/store/hooks';
import { isAxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import useJwtAuth from '../../auth/services/jwt/useJwtAuth';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().min(1, validationMessages('required')).email(validationMessages('email')),
	password: z
		.string()
		.regex(RegExps.password, validationMessages('password'))
		.min(10, validationMessages('min', { length: 10 }))
});

type FormType = z.infer<typeof schema>;

interface IProps {
	onSuccess: () => void;
}

function SignInSendCodeForm({ onSuccess }: IProps) {
	const { t } = useTranslation(i18nNamespaces.pages.signIn);
	const dispatch = useAppDispatch();
	const { sendCode, userEmail, isLoading } = useJwtAuth();

	const { control, formState, handleSubmit, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			email: userEmail,
			password: ''
		},
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	function onSubmit(formData: FormType) {
		const { email, password } = formData;

		sendCode?.({
			email,
			password
		}).then((res) => {
			if (!isAxiosError(res)) {
				dispatch(showMessage({ message: t('otpSendSuccessfully') }));
				onSuccess();
			}
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

				<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
					<Link
						className="text-md font-medium"
						to="/forgot-password"
					>
						{t('forgotPassword')}
					</Link>
				</div>

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
				<Divider
					variant="fullWidth"
					className="mt-16"
				/>
				<Button
					component="a"
					href={import.meta.env.VITE_AUT_GOOGLE_URL}
					className="mt-16"
					variant="outlined"
					color="error"
					endIcon={<FuseSvgIcon>material-outline:google</FuseSvgIcon>}
				>
					ورود با گوگل
				</Button>
			</form>
		</div>
	);
}

export default SignInSendCodeForm;
