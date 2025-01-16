import PageTemplate from 'app/shared-components/PageTemplate';
import { ICourse } from 'app/services/responseTypes';
import DataTable from 'app/shared-components/data-table/DataTable';
import { useMemo } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import Box from '@mui/material/Box';
import TableEditActionButton from 'app/shared-components/data-table/TableEditActionButton';
import TableDeleteActionButton from 'app/shared-components/data-table/TableDeleteActionButton';
import { DeleteCourse } from 'app/services/apiShortRequests';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'app/store/hooks';
import Typography from '@mui/material/Typography';
import useGetCourses from '../../hooks/api/useGetCourses';
import useDialogStatus from '../../hooks/useDialogStatus';
import CoursesFormDialog from './CoursesFormDialog';
import useGetMajors from '../../hooks/api/useGetMajors';

function CoursePage() {
	const { data: courses, isLoading, refetch } = useGetCourses();
	const { data: majors } = useGetMajors();

	const { formDialogStatus, openDialog, closeDialog } = useDialogStatus<ICourse>();
	const dispatch = useAppDispatch();

	const { mutate: deleteMutate, isPending: deletePending } = useMutation({
		mutationFn: DeleteCourse,
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

	const columns = useMemo<MRT_ColumnDef<ICourse>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'عنوان',
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
				accessorKey: 'units',
				header: 'واحد',
				filterFn: 'equals'
			},
			{
				accessorKey: 'semester',
				header: 'ترم',
				filterFn: 'equals'
			},
			{
				accessorKey: 'classroom.name',
				header: 'محل برگزاری کلاس',
				enableColumnFilter: false
			}
		],
		[majorColumnOptions]
	);
	return (
		<PageTemplate<ICourse>
			title="مدیریت درس‌ها"
			createTitle="افزودن درس جدید"
			formDialog={CoursesFormDialog}
			editData={formDialogStatus?.data}
			onEditClose={closeDialog}
		>
			<DataTable<ICourse>
				data={courses ?? []}
				columns={columns}
				state={{ isLoading }}
				renderDetailPanel={({ row: { original } }) =>
					original.professors?.map((professor) => (
						<Typography
							gutterBottom
							key={professor.id}
						>
							<Typography
								component="span"
								fontWeight={600}
								fontSize={16}
							>
								{professor.full_name}
							</Typography>
							{' | '}
							{professor.major?.name}
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
							title="درس"
							onConfirm={() => deleteMutate({ id: row.original.id })}
							isLoading={deletePending}
						/>
					</Box>
				)}
			/>
		</PageTemplate>
	);
}

export default CoursePage;
