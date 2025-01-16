// Auth
export interface IAuthLoginResponse {
	access_token: string;
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

export interface IMajor {
	id: number;
	name: string;
	semesters: number;
}

export interface IProfessorTimeSlot {
	day: number;
	start_time: string;
	end_time: string;
}

export interface IProfessor {
	full_name: string;
	major_id: number;
	max_hour: number;
	min_hour: number;
	preferred_days: number[];
	time_slots: IProfessorTimeSlot[];
	id: number;
	major: IMajor;
}
export interface IClassroom {
	id: number;
	name: string;
	available_classes: number;
}

export interface ICourse {
	title: string;
	units: number;
	duration: string;
	semester: number;
	calculated_hours: string;
	major_id: number;
	classroom_id: number;
	id: number;
	professors: IProfessor[];
	major: IMajor;
	classroom: IClassroom;
}
