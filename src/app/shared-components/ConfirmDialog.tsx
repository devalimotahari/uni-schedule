import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ReactNode } from 'react';

interface IProps {
	title: ReactNode;
	description: ReactNode;
	okLabel?: string;
	cancelLabel?: string;
	isLoading?: boolean;
	onOk: () => void;
	onCancel: () => void;
}

function ConfirmDialog({ onOk, isLoading, cancelLabel, okLabel, title, description, onCancel }: IProps) {
	return (
		<Dialog
			open
			fullWidth
			maxWidth="sm"
			onClose={onCancel}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{description}</DialogContent>
			<DialogActions>
				<Button
					color="error"
					disabled={isLoading}
					onClick={onCancel}
				>
					{cancelLabel || 'لغو'}
				</Button>
				<Button
					variant="contained"
					color="secondary"
					onClick={onOk}
					disabled={isLoading}
				>
					{okLabel || 'تایید'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmDialog;
