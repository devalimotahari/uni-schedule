import { ISolverResult } from 'app/services/responseTypes';
import DataTable from 'app/shared-components/data-table/DataTable';
import { useMemo } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import Box from '@mui/material/Box';
import TableDeleteActionButton from 'app/shared-components/data-table/TableDeleteActionButton';
import { DeleteSolverResult } from 'app/services/apiShortRequests';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from 'app/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useCalendarStore } from 'app/store/calendarStore';
import { Tooltip } from '@mui/material';
import useGetSolverResults from '../../hooks/api/useGetSolverResults';

function SolveResultList() {
	const setResultId = useCalendarStore((s) => s.setSelectedResultId);

	const { data: results, isLoading, refetch } = useGetSolverResults();

	const dispatch = useAppDispatch();

	const { mutate: deleteMutate, isPending: deletePending } = useMutation({
		mutationFn: DeleteSolverResult,
		onSuccess: () => {
			refetch();
		},
		onError: () => {
			dispatch(showMessage({ message: 'مشکلی در انجام عملیات رخ داده است.', variant: 'error' }));
		}
	});

	const columns = useMemo<MRT_ColumnDef<ISolverResult>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'عنوان'
			},
			{
				accessorKey: 'created_at',
				header: 'تاریخ ایجاد',
				Cell: ({ cell }) => new Date(cell.getValue() as string).toLocaleString('fa-IR-u-nu-latn')
			}
		],
		[]
	);
	return (
		<DataTable<ISolverResult>
			data={results ?? []}
			columns={columns}
			state={{ isLoading }}
			renderRowActions={({ row }) => (
				<Box
					className="flex justify-end w-full"
					maxWidth={130}
				>
					<Tooltip title="مشاهده برنامه درسی">
						<IconButton
							onClick={() => {
								setResultId(row.original.id);
							}}
						>
							<FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
						</IconButton>
					</Tooltip>
					<TableDeleteActionButton
						title="برنامه درسی پردازش شده"
						onConfirm={() => deleteMutate({ id: row.original.id })}
						isLoading={deletePending}
					/>
				</Box>
			)}
		/>
	);
}

export default SolveResultList;
