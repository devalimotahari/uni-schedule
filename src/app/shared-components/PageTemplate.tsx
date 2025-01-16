import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ComponentType, createElement, ReactNode, useState } from 'react';

export interface IFormDialogProps<T> {
	initialData?: T;
	onClose: () => void;
}

interface IProps<T> {
	title: ReactNode;
	titleEndElement?: ReactNode;
	children: ReactNode;
	createTitle?: string;
	formDialog?: ComponentType<IFormDialogProps<T>>;
	customFilters?: ReactNode;
	isLoading?: boolean;
	isNoData?: boolean;
	editData?: T;
	onEditClose?: () => void;
}

function PageTemplate<T>({
	title,
	titleEndElement,
	children,
	isLoading,
	isNoData,
	createTitle,
	customFilters,
	editData,
	onEditClose,
	formDialog
}: IProps<T>) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const onClose = () => {
		onEditClose?.();
		setIsDialogOpen(false);
	};

	const isShowPaper = !!createTitle || !!customFilters;

	return (
		<>
			{formDialog && (isDialogOpen || editData) && createElement(formDialog, { initialData: editData, onClose })}

			<FusePageSimple
				header={
					<Box className="w-full flex justify-between items-center gap-5">
						<h4 className="font-bold text-lg">{title}</h4>
						{titleEndElement}
					</Box>
				}
				scroll="page"
				content={
					<section className="w-full h-full p-12 md:p-24">
						{isShowPaper && (
							<Paper
								variant="outlined"
								className="p-24 mb-24 rounded-lg flex flex-col gap-20"
							>
								{!!createTitle && (
									<Button
										className="w-fit"
										variant="contained"
										color="secondary"
										onClick={() => setIsDialogOpen(true)}
									>
										{createTitle}
									</Button>
								)}
								{customFilters}
							</Paper>
						)}
						{isLoading && <FuseLoading />}
						{!isLoading && (
							<Paper
								style={{ direction: 'rtl' }}
								className="my-24 p-24 rounded-lg"
								variant="outlined"
							>
								{isNoData && (
									<Typography
										align="center"
										variant="subtitle2"
									>
										موردی وجود ندارد!
									</Typography>
								)}
								{!isNoData && children}
							</Paper>
						)}
					</section>
				}
			/>
		</>
	);
}

export default PageTemplate;
