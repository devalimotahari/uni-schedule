import { IconEdit } from '@aws-amplify/ui-react/internal';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from '@lodash';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { validationMessages } from 'app/configs/validationMessages-i18n';
import { i18nNamespaces } from 'app/constants';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import useJwtAuth from '../../auth/services/jwt/useJwtAuth';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().min(1, validationMessages('required')).email(validationMessages('email')),
	totp: z.string().min(1, validationMessages('required'))
});

type FormType = z.infer<typeof schema>;

interface IProps {
	onBackStep: () => void;
}

function SignInSendCodeForm({ onBackStep }: IProps) {
	const { t } = useTranslation(i18nNamespaces.pages.signIn);

	const { signIn, userEmail, isLoading } = useJwtAuth();

	const { control, formState, handleSubmit, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			totp: '',
			email: userEmail
		},
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	function onSubmit(formData: FormType) {
		const { email, totp } = formData;

		signIn?.({
			email,
			totp
		}).catch(
			(
				error: AxiosError<
					{
						type: 'email' | 'totp' | `root.${string}` | 'root';
						message: string;
					}[]
				>
			) => {
				const errorData = error.response?.data;

				errorData.forEach((err) => {
					setError(err.type, {
						type: 'manual',
						message: err.message
					});
				});
			}
		);
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
							disabled
							className="mb-24"
							label={t('email')}
							autoFocus
							type="email"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							variant="outlined"
							required
							fullWidth
							InputProps={{
								endAdornment: (
									<IconButton onClick={onBackStep}>
										<IconEdit />
									</IconButton>
								)
							}}
						/>
					)}
				/>

				<Controller
					name="totp"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							className="mb-24"
							inputProps={{ className: 'ltr text-center' }}
							label={t('otp')}
							type="text"
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

export default SignInSendCodeForm;
