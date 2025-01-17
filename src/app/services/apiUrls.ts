export const ApiUrls = {
	auth: {
		login: '/auth/login',
		register: '/auth/register'
	},
	calculate: '/calc',
	solver: {
		solve: '/solver/solve',
		list: '/solver/resualt',
		create: '/solver/resualt',
		getById: '/solver/resualt/{id}',
		delete: '/solver/resualt/{id}'
	},
	majors: {
		list: '/majors',
		create: '/majors',
		getById: '/majors/{id}',
		update: '/majors/{id}',
		delete: '/majors/{id}'
	},
	courses: {
		list: '/courses',
		create: '/courses',
		getById: '/courses/{id}',
		update: '/courses/{id}',
		delete: '/courses/{id}'
	},
	classrooms: {
		list: '/classrooms',
		create: '/classrooms',
		getById: '/classrooms/{id}',
		update: '/classrooms/{id}',
		delete: '/classrooms/{id}'
	},
	professors: {
		list: '/professors',
		create: '/professors',
		getById: '/professors/{id}',
		update: '/professors/{id}',
		delete: '/professors/{id}'
	}
};
