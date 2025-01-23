import { ControllerFieldState } from 'react-hook-form';
import { IEvent } from 'app/store/calendarStore';
import { ISolverResultCourse } from 'app/services/responseTypes';

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

function generateHexColorFromNumber(input: number): string {
	// Normalize the input and calculate RGB components
	const cappedInput = Math.abs(input % 256); // Keep within 0-255
	const red = (cappedInput * 3) % 256; // Generate red component
	const green = (cappedInput * 5) % 256; // Generate green component
	const blue = (cappedInput * 7) % 256; // Generate blue component

	// Generate the hex color
	const redHex = red.toString(16).padStart(2, '0');
	const greenHex = green.toString(16).padStart(2, '0');
	const blueHex = blue.toString(16).padStart(2, '0');

	return `#${redHex}${greenHex}${blueHex}`;
}

export const semisterColors: Record<string, string> = {
	'1': '#624da5',
	'2': '#00a84e',
	'3': '#ef000f',
	'4': '#bcabaf',
	'5': '#14647f',
	'6': '#8bf4c3',
	'7': '#d3dd9f',
	'8': '#e23ba8'
};

export const parseDateToTimeFormat = (date: Date | null): string => {
	if (date === null) return '';

	const hours = date.getHours();
	const minutes = date.getMinutes();

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
export const parseTimeFormatToDate = (time: string | null): Date | null => {
	if (time == null) return null;

	const [hours, minutes] = time.split(':');
	const date = new Date();
	date.setHours(+hours);
	date.setMinutes(+minutes);

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

export const convertResultCourseToEvent = (item: ISolverResultCourse): IEvent => {
	const startDate = new Date(2024, 5, item.selected_slot.day + 3);
	const endDate = new Date(2024, 5, item.selected_slot.day + 3);

	const data = {
		id: uuidv4(),
		title: `
		درس 
		${item.title}، 
		استاد 
		${item.selected_slot.professor_name}
		`,
		start: `${startDate.toISOString().replace(/T.*$/, '')}T${item.selected_slot.start_time.substring(0, 2)}:${item.selected_slot.start_time.substring(3)}:00`,
		end: `${endDate.toISOString().replace(/T.*$/, '')}T${item.selected_slot.end_time.substring(0, 2)}:${item.selected_slot.end_time.substring(3)}:00`,
		allDay: false,
		backgroundColor: generateHexColorFromNumber(item.semester * 7 + item.group_id),
		extendedProps: {
			desc: item.selected_slot.prefered ? 'روز ترجیحی استاد' : '',
			label: `
				ترم 
				${item.semester}، 

				${item.classroom_name}، 
				رشته 
				${item.major_name}
			`
		}
	};
	return data;
};
