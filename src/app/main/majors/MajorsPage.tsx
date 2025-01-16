import PageTemplate from 'app/shared-components/PageTemplate';
import { IMajor } from 'app/services/responseTypes';
import DataTable from 'app/shared-components/data-table/DataTable';
import { useMemo } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import Box from '@mui/material/Box';
import TableEditActionButton from 'app/shared-components/data-table/TableEditActionButton';
import TableDeleteActionButton from 'app/shared-components/data-table/TableDeleteActionButton';
import { DeleteMajor } from 'app/services/apiShortRequests';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from 'app/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import useGetMajors from '../../hooks/api/useGetMajors';
import useDialogStatus from '../../hooks/useDialogStatus';
import MajorsFormDialog from './MajorsFormDialog';

function MajorsPage() {
	const { data: majors, isLoading, refetch } = useGetMajors();

	const { formDialogStatus, openDialog, closeDialog } = useDialogStatus<IMajor>();
	const dispatch = useAppDispatch();

	const { mutate: deleteMutate, isPending: deletePending } = useMutation({
		mutationFn: DeleteMajor,
		onSuccess: () => {
			refetch();
		},
		onError: () => {
			dispatch(showMessage({ message: 'مشکلی در انجام عملیات رخ داده است.', variant: 'error' }));
		}
	});

	const columns = useMemo<MRT_ColumnDef<IMajor>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'عنوان'
			},
			{
				accessorKey: 'semesters',
				header: 'تعداد ترم'
			}
		],
		[]
	);
	return (
		<PageTemplate<IMajor>
			title="مدیریت رشته‌های درسی"
			createTitle="ساخت رشته درسی جدید"
			formDialog={MajorsFormDialog}
			editData={formDialogStatus?.data}
			onEditClose={closeDialog}
		>
			<DataTable<IMajor>
				data={majors ?? []}
				columns={columns}
				state={{ isLoading }}
				renderRowActions={({ row }) => (
					<Box
						className="flex justify-end w-full"
						maxWidth={130}
					>
						<TableEditActionButton onClick={() => openDialog(row.original)} />
						<TableDeleteActionButton
							title="رشته درسی"
							onConfirm={() => deleteMutate({ id: row.original.id })}
							isLoading={deletePending}
						/>
					</Box>
				)}
			/>
		</PageTemplate>
	);
}

export default MajorsPage;
