import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

interface IProps {
	onClick: () => void;
}

function TableEditActionButton({ onClick }: IProps) {
	return (
		<Tooltip title="ویرایش">
			<IconButton
				onClick={onClick}
				color="primary"
			>
				<FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
			</IconButton>
		</Tooltip>
	);
}

export default TableEditActionButton;
