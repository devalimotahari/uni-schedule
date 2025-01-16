import PageTemplate from 'app/shared-components/PageTemplate';
import { IProfessor } from 'app/services/responseTypes';
import DataTable from 'app/shared-components/data-table/DataTable';
import { useMemo } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import Box from '@mui/material/Box';
import TableEditActionButton from 'app/shared-components/data-table/TableEditActionButton';
import TableDeleteActionButton from 'app/shared-components/data-table/TableDeleteActionButton';
import { DeleteProfessor } from 'app/services/apiShortRequests';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'app/store/hooks';
import Typography from '@mui/material/Typography';
import useGetProfessors from '../../hooks/api/useGetProfessors';
import useDialogStatus from '../../hooks/useDialogStatus';
import ProfessorsFormDialog from './form/ProfessorsFormDialog';
import { weekDays } from '../../utils/utils';
import useGetMajors from '../../hooks/api/useGetMajors';

function ProfessorPage() {
	const { data: professors, isLoading, refetch } = useGetProfessors();
	const { data: majors } = useGetMajors();

	const { formDialogStatus, openDialog, closeDialog } = useDialogStatus<IProfessor>();
	const dispatch = useAppDispatch();

	const { mutate: deleteMutate, isPending: deletePending } = useMutation({
		mutationFn: DeleteProfessor,
		onSuccess: () => {
			refetch();
		},
		onError: () => {
			dispatch(showMessage({ message: 'مشکلی در انجام عملیات رخ داده است.', variant: 'error' }));
		}
	});

	const majorColumnOptions = useMemo(
		() =>
			majors?.map((m) => ({
				label: m.name,
				value: m.name
			})),
		[majors]
	);

	const columns = useMemo<MRT_ColumnDef<IProfessor>[]>(
		() => [
			{
				accessorKey: 'full_name',
				header: 'نام و نام خانوادگی',
				filterFn: 'contains'
			},
			{
				accessorKey: 'major.name',
				header: 'رشته درسی',
				filterVariant: 'autocomplete',
				filterSelectOptions: majorColumnOptions,
				filterFn: 'equalsString'
			},
			{
				accessorKey: 'min_hour',
				header: 'حداقل ساعت مجاز تدریس',
				filterFn: 'equals'
			},
			{
				accessorKey: 'max_hour',
				header: 'حداکثر ساعت مجاز تدریس',
				filterFn: 'equals'
			},
			{
				accessorKey: 'preferred_days',
				enableColumnFilter: false,
				header: 'روزهای ترجیحی',
				Cell: ({ cell }) => (cell.getValue() as Array<number>)?.map((d) => weekDays[d])?.join(' - ') || '---'
			}
		],
		[majorColumnOptions]
	);
	return (
		<PageTemplate<IProfessor>
			title="مدیریت استادها"
			createTitle="افزودن استاد"
			formDialog={ProfessorsFormDialog}
			editData={formDialogStatus?.data}
			onEditClose={closeDialog}
		>
			<DataTable<IProfessor>
				data={professors ?? []}
				columns={columns}
				state={{ isLoading }}
				renderDetailPanel={({ row: { original } }) =>
					original.time_slots?.map((timeSlot) => (
						<Typography
							gutterBottom
							key={`${timeSlot.day}-${timeSlot.start_time}-${timeSlot.end_time}`}
						>
							{weekDays[timeSlot.day]}
							{' از '}
							{timeSlot.start_time}
							{' تا '}
							{timeSlot.end_time}
						</Typography>
					))
				}
				renderRowActions={({ row }) => (
					<Box
						className="flex justify-end w-full"
						maxWidth={130}
					>
						<TableEditActionButton onClick={() => openDialog(row.original)} />
						<TableDeleteActionButton
							title="استاد"
							onConfirm={() => deleteMutate({ id: row.original.id })}
							isLoading={deletePending}
						/>
					</Box>
				)}
			/>
		</PageTemplate>
	);
}

export default ProfessorPage;
