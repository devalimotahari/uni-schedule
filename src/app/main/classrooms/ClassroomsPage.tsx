import PageTemplate from 'app/shared-components/PageTemplate';
import { IClassroom } from 'app/services/responseTypes';
import DataTable from 'app/shared-components/data-table/DataTable';
import { useMemo } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import Box from '@mui/material/Box';
import TableEditActionButton from 'app/shared-components/data-table/TableEditActionButton';
import TableDeleteActionButton from 'app/shared-components/data-table/TableDeleteActionButton';
import { DeleteClassroom } from 'app/services/apiShortRequests';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'app/store/hooks';
import useGetClassrooms from '../../hooks/api/useGetClassrooms';
import useDialogStatus from '../../hooks/useDialogStatus';
import ClassroomsFormDialog from './ClassroomsFormDialog';

function ClassroomPage() {
	const { data: classrooms, isLoading, refetch } = useGetClassrooms();

	const { formDialogStatus, openDialog, closeDialog } = useDialogStatus<IClassroom>();
	const dispatch = useAppDispatch();

	const { mutate: deleteMutate, isPending: deletePending } = useMutation({
		mutationFn: DeleteClassroom,
		onSuccess: () => {
			refetch();
		},
		onError: () => {
			dispatch(showMessage({ message: 'مشکلی در انجام عملیات رخ داده است.', variant: 'error' }));
		}
	});

	const columns = useMemo<MRT_ColumnDef<IClassroom>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'عنوان'
			},
			{
				accessorKey: 'available_classes',
				header: 'تعداد کلاس‌های دردسترس'
			}
		],
		[]
	);
	return (
		<PageTemplate<IClassroom>
			title="مدیریت مجموعه کلاس‌ها"
			createTitle="ساخت مجموعه کلاس جدید"
			formDialog={ClassroomsFormDialog}
			editData={formDialogStatus?.data}
			onEditClose={closeDialog}
		>
			<DataTable<IClassroom>
				data={classrooms ?? []}
				columns={columns}
				state={{ isLoading }}
				renderRowActions={({ row }) => (
					<Box
						className="flex justify-end w-full"
						maxWidth={130}
					>
						<TableEditActionButton onClick={() => openDialog(row.original)} />
						<TableDeleteActionButton
							title="محل مجموعه کلاس"
							onConfirm={() => deleteMutate({ id: row.original.id })}
							isLoading={deletePending}
						/>
					</Box>
				)}
			/>
		</PageTemplate>
	);
}

export default ClassroomPage;
