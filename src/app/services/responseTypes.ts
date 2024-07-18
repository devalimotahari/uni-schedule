// Auth
import { User } from '../auth/user';

export interface IAuthLoginResponse {
	access_token: string;
	user: User;
}
