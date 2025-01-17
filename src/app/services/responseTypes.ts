// Auth
export interface IAuthLoginResponse {
	access_token: string;
}

// solver
export interface ISolverResult {
	name: string;
	id: number;
	created_at: string;
}

export interface ISolverResultCourseSelectedSlot {
	day: number;
	professor_id: number;
	professor_name: string;
	start_time: string;
	end_time: string;
	prefered: boolean;
}

export interface ISolverResultCourse {
	id: number;
	title: string;
	units: number;
	duration: string;
	semester: number;
	calculated_hours: number;
	major_id: number;
	classroom_id: number;
	max_classes: number;
	group_id: number;
	major_name: string;
	classroom_name: string;
	selected_slot: ISolverResultCourseSelectedSlot;
}

export interface ISolverResultItem extends ISolverResult {
	resualt: Array<{
		courses: ISolverResultCourse[];
	}>;
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

export interface ICourseLight {
	title: string;
	units: number;
	duration: string;
	semester: number;
	calculated_hours: string;
	major_id: number;
	classroom_id: number;
	id: number;
	professors: number[];
}
