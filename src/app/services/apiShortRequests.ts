// Auth
import { apiClient as api } from 'app/services/apiClient';
import { ApiUrls as urls } from 'app/services/apiUrls';
import { IAuthLogin, IAuthRegister, ICalculateBody } from 'app/services/requestTypes';
import { IAuthLoginResponse, ICalculateResponse } from 'app/services/responseTypes';

// Auth
export const PostAuthLogin = (body: IAuthLogin) => api.post<IAuthLoginResponse>(urls.auth.login, body);
export const PostAuthRegister = (body: IAuthRegister) => api.post(urls.auth.register, body);

// uni
export const PostCalculate = (body: ICalculateBody) => api.post<ICalculateResponse>(urls.calculate, body);
