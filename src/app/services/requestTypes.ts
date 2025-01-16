// Auth
import { IClassroom, IMajor, IProfessorTimeSlot } from 'app/services/responseTypes';

export interface IReqId<T = number> {
	id: T;
}

export interface IAuthLogin {
	username: string;
	password: string;
}
export interface IAuthRegister {
	username: string;
	password: string;
}

// calculate
export interface ICalculateBody {
	settings: Record<string, any>;
	data: {
		professors: any;
		courses: any;
	};
}

export type ICreateMajor = Omit<IMajor, 'id'>;
export type IUpdateMajor = IMajor;

export interface ICreateProfessor {
	full_name: string;
	major_id: number;
	max_hour: number;
	min_hour: number;
	preferred_days: number[];
	time_slots: IProfessorTimeSlot[];
}
export interface IUpdateProfessor extends ICreateProfessor {
	id: number;
}

export type ICreateClassroom = Omit<IClassroom, 'id'>;
export type IUpdateClassroom = IClassroom;

export interface ICreateCourse {
	title: string;
	units: number;
	duration: string;
	semester: number;
	calculated_hours: number;
	major_id: number;
	classroom_id: number;
	professor_ids: number[];
}

export interface IUpdateCourse extends ICreateCourse {
	id: number;
}
