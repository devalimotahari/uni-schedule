import { User } from '../auth/user';

// Auth
export interface IAuthLoginResponse {
	access_token: string;
	user: User;
}

// calc
interface ICourseResult {
	day: number;
	end: string;
	id: string;
	is_prefered_time: boolean;
	professor_id: string;
	start: string;
}

export interface ICalculateResponseResult {
	courses: ICourseResult[];
	score: number;
}

export interface ICalculateResponse {
	data: {
		resualts: ICalculateResponseResult[];
	};
	message: string;
}
