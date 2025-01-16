import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import ConfirmDialog from 'app/shared-components/ConfirmDialog';

interface IProps {
	title?: string;
	onConfirm: () => void;
	isLoading?: boolean;
}

function TableDeleteActionButton({ title, onConfirm, isLoading }: IProps) {
	const [isOpen, setIsOpen] = useState(false);

	const closeDialog = () => {
		setIsOpen(false);
	};

	const openDialog = () => {
		setIsOpen(true);
	};

	return (
		<>
			{isOpen && (
				<ConfirmDialog
					title={`حذف ${title ?? ''}`}
					description="برای حذف این مورد اطمینان دارید؟"
					onCancel={closeDialog}
					onOk={() => {
						onConfirm();
						closeDialog();
					}}
					isLoading={isLoading}
				/>
			)}
			<Tooltip title="حذف">
				<IconButton
					disabled={isLoading}
					onClick={openDialog}
					color="error"
				>
					<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
				</IconButton>
			</Tooltip>
		</>
	);
}

export default TableDeleteActionButton;
