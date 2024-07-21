export const weekDays = ['شنبه', 'یک شنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export const uuidv4 = () =>
	'10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
		// eslint-disable-next-line
		(+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
	);

export const parseDateToTimeFormat = (date: Date | null): string => {
	if (date === null) return '';

	const hours = date.getHours();
	const minutes = date.getMinutes();

	return `${hours}:${minutes}`;
};
export const parseTimeFormatToDate = (time: string | null): Date | null => {
	if (time == null) return null;

	const [hours, minutes] = time.split(':');
	const date = new Date();
	date.setHours(hours);
	date.setMinutes(minutes);

	return date;
};
