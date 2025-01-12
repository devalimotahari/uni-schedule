// Auth
export interface IAuthLogin {
	username: string;
	password: string;
}
export interface IAuthRegister {
	username: string;
	password: string;
}

// calc

export interface IProfessorData {
	id: string;
	name: string;
	pref_days: number[];
	days: string[];
}

export interface ICourseData {
	id: string;
	name: string;
	units: number;
	duration: string;
	semister: number;
	professors: string[];
}

export interface ICalculateBody {
	settings: Record<string, any>;
	data: {
		professors: Array<IProfessorData>;
		courses: Array<ICourseData>;
	};
}
