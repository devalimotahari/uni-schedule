import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ILabel {
	id: string;
	color: string;
	title: string;
}

export interface IEvent {
	id: string;
	title: string;
	allDay: boolean;
	start: string;
	end: string;
	extendedProps: {
		desc: string;
		label: string;
	};
}

interface ICalendarStore {
	labels: ILabel[];
	events: IEvent[];
	selectedLabels: Array<string>;
	toggleSelectedLabels: (labelId: string) => void;
}

export const useCalendarStore = create<ICalendarStore>()(
	devtools(
		persist(
			(set) => ({
				labels: [],
				events: [],
				selectedLabels: [],
				toggleSelectedLabels: () => {}
			}),
			{ name: 'CalendarStore' }
		)
	)
);
