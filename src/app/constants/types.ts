export type DeepRequired<T> = {
	[K in keyof T]: Required<DeepRequired<T[K]>>;
};

export type DeepPartial<T> = {
	[K in keyof T]?: Partial<DeepPartial<T[K]>>;
};

export interface IDialogStatus<T> {
	data?: T;
	isOpen: boolean;
}
