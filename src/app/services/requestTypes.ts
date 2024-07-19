// Auth
export interface IAuthSendCode {
	email: string;
	password: string;
}
export interface IAuthLogin {
	email: string;
	totp: string;
}
export interface IAuthForgotPassword {
	email?: string;
	newPassword?: string;
	hash?: string;
}
export interface IAuthRegister {
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	password: string;
}

// calc

export interface IProfessorData {
	id: number;
	name: string;
	pref_days: number[];
	days: string[];
}

export interface ICourseData {
	id: number;
	name: string;
	units: number;
	duration: string;
	semister: number;
	professors: number[];
}

export interface ICalculateBody {
	settings: Record<string, any>;
	data: {
		professors: Array<IProfessorData>;
		courses: Array<ICourseData>;
	};
}
