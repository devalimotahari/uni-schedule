import { useState } from 'react';
import { IDialogStatus } from '../constants/types';

export default function useDialogStatus<T>() {
	const [formDialogStatus, setFormDialogStatus] = useState<IDialogStatus<T>>({ isOpen: false });

	const closeDialog = () => {
		setFormDialogStatus({ isOpen: false });
	};

	const openDialog = (data?: T) => {
		setFormDialogStatus({ isOpen: true, data });
	};

	return { formDialogStatus, openDialog, closeDialog };
}
