import { User } from '../auth/user';

// Auth
export interface IAuthLoginResponse {
	access_token: string;
	user: User;
}

// calc
interface ICourseResult {
	day: number;
	duration: string;
	end: string;
	id: number;
	is_prefered_time: boolean;
	name: string;
	professor_id: number;
	semister: number;
	start: string;
	units: number;
}

export interface ICalculateResponse {
	data: {
		resualts: Array<Array<ICourseResult>>;
	};
	message: string;
}
