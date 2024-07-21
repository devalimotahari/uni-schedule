import { ICalculateResponseResult } from 'app/services/responseTypes';
import { ControllerFieldState } from 'react-hook-form';
import { IEvent, useCalendarStore } from './calendarStore';

export const weekDays = ['شنبه', 'یک شنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export const uuidv4 = () =>
	'10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
		// eslint-disable-next-line
		(+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
	);

export function getRandomColor(str: string): string {
	let hash: number = 0;

	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < str.length; i++) {
		// eslint-disable-next-line no-bitwise
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
		// eslint-disable-next-line no-bitwise
		hash &= hash;
	}
	let color = '#';
	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < 3; i++) {
		// eslint-disable-next-line no-bitwise
		const value = (hash >> (i * 8)) & 255;
		color += `00${value.toString(16)}`.substr(-2);
	}
	return color;
}

export const parseDateToTimeFormat = (date: Date | null): string => {
	if (date === null) return '';

	const hours = date.getHours();
	const minutes = date.getMinutes();

	return `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}`;
};
export const parseTimeFormatToDate = (time: string | null): Date | null => {
	if (time == null) return null;

	const [hours, minutes] = time.split(':');
	const date = new Date();
	date.setHours(hours);
	date.setMinutes(minutes);

	return date;
};

export const commonTimePickerProps = (fieldState: ControllerFieldState) => ({
	ampm: false,
	slotProps: {
		layout: {
			className: 'ltr'
		},
		toolbar: {
			className: 'ltr'
		},
		textField: {
			fullWidth: true,
			size: 'small',
			error: !!fieldState.error
		}
	}
});

const dayNumToJalaliDayNum = {
	0: 6,
	1: 0,
	2: 1,
	3: 2,
	4: 3,
	5: 4,
	6: 5
};

export const convertResultCourseToEvent = (item: ICalculateResponseResult['courses'][number]): IEvent => {
	const { professors, courses } = useCalendarStore.getState();
	const professor = professors.find((p) => p.id === item.professor_id);
	const course = courses.find((c) => c.id === item.id);

	const startDate = new Date();

	const currentDay = startDate.getDay() - 2;
	const distance = dayNumToJalaliDayNum[item.day] - currentDay;

	startDate.setDate(startDate.getDate() + distance);

	const endDate = new Date();
	endDate.setDate(endDate.getDate() + distance);

	return {
		id: uuidv4(),
		title: `${course.name} - ${professor.name}`,
		start: `${startDate.toISOString().replace(/T.*$/, '')}T${item.start.substring(0, 2)}:${item.start.substring(2)}:00`,
		end: `${endDate.toISOString().replace(/T.*$/, '')}T${item.end.substring(0, 2)}:${item.end.substring(2)}:00`,
		allDay: false,
		backgroundColor: getRandomColor(course.id),
		extendedProps: {
			desc: item.is_prefered_time ? 'روز ترجیحی استاد' : '',
			label: `${course.name} - ${professor.name}`
		}
	};
};
