// Auth
import { apiClient as api } from 'app/services/apiClient';
import { ApiUrls as urls } from 'app/services/apiUrls';
import { IAuthForgotPassword, IAuthLogin, IAuthRegister, IAuthSendCode } from 'app/services/requestTypes';
import { IAuthLoginResponse } from 'app/services/responseTypes';
import { User } from '../auth/user';

// Auth
export const PostAuthSendCode = (body: IAuthSendCode) => api.post(urls.auth.sendCode, body);
export const PostAuthLogin = (body: IAuthLogin) => api.post<IAuthLoginResponse>(urls.auth.login, body);
export const PostAuthForgotPassword = (body: IAuthForgotPassword) => api.post(urls.auth.forgetPassword, body);
export const PostAuthRegister = (body: IAuthRegister) => api.post(urls.auth.register, body);

// users
export const GetUserProfile = (params?: { token?: string }) =>
	api.get<User>(urls.users.profile, {
		headers: { Authorization: params?.token ? `Bearer ${params.token}` : undefined }
	});
