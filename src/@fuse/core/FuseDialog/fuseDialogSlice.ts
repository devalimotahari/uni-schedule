import { DialogProps } from '@mui/material';
import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from 'app/store/lazyLoadedSlices';
import { ReactElement } from 'react';

type InitialStateProps = {
	open: boolean;
	children: ReactElement | string;
	props?: Omit<DialogProps, 'open' | 'children'>;
};

/**
 * The initial state of the dialog slice.
 */
const initialState: InitialStateProps = {
	open: false,
	children: '',
	props: {}
};

/**
 * The Fuse Dialog slice
 */
export const fuseDialogSlice = createSlice({
	name: 'fuseDialog',
	initialState,
	reducers: {
		openDialog: (state, action: PayloadAction<Omit<InitialStateProps, 'open'>>) => {
			state.open = true;
			state.children = action.payload.children;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			state.props = action.payload.props;
		},
		closeDialog: () => initialState
	},
	selectors: {
		selectFuseDialogState: (fuseDialog) => fuseDialog.open,
		selectFuseDialogProps: (fuseDialog) => fuseDialog
	}
});

/**
 * Lazy load
 * */
rootReducer.inject(fuseDialogSlice);
const injectedSlice = fuseDialogSlice.injectInto(rootReducer);
declare module 'app/store/lazyLoadedSlices' {
	export interface LazyLoadedSlices extends WithSlice<typeof fuseDialogSlice> {}
}

export const { closeDialog, openDialog } = fuseDialogSlice.actions;

export const { selectFuseDialogState, selectFuseDialogProps } = injectedSlice.selectors;

export type dialogSliceType = typeof fuseDialogSlice;

export default fuseDialogSlice.reducer;
