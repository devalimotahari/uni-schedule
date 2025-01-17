import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
	backgroundColor?: string;
	extendedProps: {
		desc: string;
		label: string;
	};
}

interface ICalendarStore {
	labels: ILabel[];
	events: IEvent[];

	selectedResultId: number | null;
	setSelectedResultId: (id: number | null) => void;
}

export const useCalendarStore = create<ICalendarStore>()(
	devtools(
		(set) => ({
			labels: [],
			events: [],

			selectedResultId: null,
			setSelectedResultId: (id) => set(() => ({ selectedResultId: id }))
		}),
		{ name: 'CalendarStore' }
	)
);
