import { styled } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { useCalendarStore } from 'app/store/calendarStore';
import FuseLoading from '@fuse/core/FuseLoading';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import { IMajor, IProfessor } from 'app/services/responseTypes';
import { convertResultCourseToEvent } from '../../utils/utils';
import useGetSolverResultById from '../../hooks/api/useGetSolverResultById';
import useGetMajors from '../../hooks/api/useGetMajors';
import useGetProfessors from '../../hooks/api/useGetProfessors';
import CalendarView from './CalendarView';

const Root = styled('div')(({ theme }) => ({
	'& a': {
		color: `${theme.palette.text.primary}!important`,
		textDecoration: 'none!important'
	},
	'&  .fc-media-screen': {
		minHeight: '100%',
		width: '100%'
	},
	'&  .fc-event-main': {
		overflow: 'auto'
	},
	'& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th': {
		borderColor: `${theme.palette.divider}!important`
	},
	'&  .fc-scrollgrid-section > td': {
		border: 0
	},
	'& .fc-daygrid-day': {
		'&:last-child': {
			borderRight: 0
		}
	},
	'& .fc-col-header-cell': {
		borderWidth: '0 1px 0 1px',
		padding: '8px 0 0 0',
		'& .fc-col-header-cell-cushion': {
			color: theme.palette.text.secondary,
			fontWeight: 500,
			fontSize: 12,
			textTransform: 'uppercase'
		}
	},
	'& .fc-view ': {
		'& > .fc-scrollgrid': {
			border: 0
		}
	},
	'& .fc-daygrid-day.fc-day-today': {
		backgroundColor: 'transparent!important',
		'& .fc-daygrid-day-number': {
			borderRadius: '100%',
			backgroundColor: `${theme.palette.secondary.main}!important`,
			color: `${theme.palette.secondary.contrastText}!important`
		}
	},
	'& .fc-daygrid-day-top': {
		justifyContent: 'center',

		'& .fc-daygrid-day-number': {
			color: theme.palette.text.secondary,
			fontWeight: 500,
			fontSize: 12,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: 26,
			height: 26,
			margin: '4px 0',
			borderRadius: '50%',
			float: 'none',
			lineHeight: 1
		}
	},
	'& .fc-h-event': {
		background: 'initial'
	},
	'& .fc-event': {
		border: 0,
		padding: '0 ',
		fontSize: 12,
		minWidth: 180,
		margin: '0 6px 4px 6px!important'
	}
}));

interface IFilter {
	major?: IMajor;
	professor?: IProfessor;
	semester?: number;
}

/**
 * The calendar app.
 */
function CalendarApp() {
	const [selectedResultId, setResultId] = useCalendarStore((state) => [
		state.selectedResultId,
		state.setSelectedResultId
	]);

	const { data: solverResult, isLoading } = useGetSolverResultById({ id: selectedResultId ?? undefined });
	const { data: majors, isLoading: majorsLoading } = useGetMajors();
	const { data: professors, isLoading: professorsLoading } = useGetProfessors();

	const [resultIndex, setResultIndex] = useState<number>(0);
	const [filter, setFilter] = useState<IFilter>({});

	const handleChangeFilter = (name: keyof IFilter, value: IFilter[keyof IFilter] | null) => {
		setFilter((o) => ({ ...o, [name]: value }));
	};

	const events = useMemo(() => {
		const filteredCourses =
			solverResult?.resualt?.[resultIndex]?.courses.filter(
				(c) =>
					(filter.major?.id ?? c.major_id) === c.major_id &&
					(filter.semester ?? c.semester) === c.semester &&
					(filter.professor?.id ?? c.selected_slot.professor_id) === c.selected_slot.professor_id
			) ?? [];

		return filteredCourses.map(convertResultCourseToEvent);
	}, [solverResult, resultIndex, filter.major?.id, filter.semester, filter.professor?.id]);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!solverResult) {
		return (
			<div className="min-h-[80dvh] h-full w-full grid place-content-center">
				<Typography variant="h6">برنامه مورد نظر شما وجود ندارد!</Typography>
			</div>
		);
	}

	return (
		<Root className="w-full flex flex-col gap-44 p-12 md:p-32">
			<div className="w-full flex gap-5 items-center justify-between">
				<Typography>
					شما در حال مشاهده برنامه درسی
					{` ${solverResult.name} `}
					ایجاد شده در تاریخ
					{` ${new Date(solverResult.created_at).toLocaleString('fa-IR-u-nu-latn')} `}
					هستید
				</Typography>
				<Button
					onClick={() => {
						setResultId(null);
					}}
					variant="outlined"
					size="small"
					color="primary"
				>
					بازگشت به لیست
				</Button>
			</div>
			<div className="w-full flex flex-wrap items-center gap-20">
				<Typography
					variant="subtitle2"
					className="flex-1 min-w-full"
					gutterBottom
				>
					فیلترها:
				</Typography>
				{solverResult.resualt.length > 1 && (
					<Autocomplete<{ label: string; value: number }>
						className="w-[250px]"
						value={{ label: `برنامه شماره ${resultIndex + 1}`, value: resultIndex }}
						options={
							solverResult.resualt.map((_, index) => ({
								label: `برنامه شماره ${index + 1}`,
								value: index
							})) ?? []
						}
						getOptionKey={(o) => o.value}
						isOptionEqualToValue={(o, v) => o.value === v.value}
						filterSelectedOptions
						getOptionLabel={(o) => o.label}
						onChange={(e, v) => setResultIndex(v.value)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="یکی از برنامه درسی‌های ساخته شده را انتخاب نمایید"
							/>
						)}
					/>
				)}
				<TextField
					className="w-[100px]"
					label="ترم"
					type="number"
					inputProps={{
						min: 1,
						max: 8
					}}
					value={filter.semester}
					onChange={({ target: { value } }) => handleChangeFilter('semester', value ? +value : null)}
				/>
				<Autocomplete<IMajor>
					className="w-xs"
					value={filter.major}
					loading={majorsLoading}
					options={majors ?? []}
					getOptionKey={(o) => o.id}
					isOptionEqualToValue={(o, v) => o.id === v.id}
					filterSelectedOptions
					getOptionLabel={(o) => `${o.name} (${o.semesters})`}
					onChange={(e, v) => handleChangeFilter('major', v)}
					renderInput={(params) => (
						<TextField
							{...params}
							label="رشته درسی"
						/>
					)}
				/>
				<Autocomplete<IProfessor>
					className="w-xs"
					value={filter.professor}
					options={professors?.filter((p) => p.major_id === (filter.major?.id ?? p.major_id)) ?? []}
					loading={professorsLoading}
					getOptionKey={(o) => o.id}
					autoHighlight
					isOptionEqualToValue={(o, v) => o.id === v.id}
					filterSelectedOptions
					getOptionLabel={(o) => `${o.full_name} (${o.major?.name || '-'})`}
					onChange={(e, v) => handleChangeFilter('professor', v)}
					renderInput={(params) => (
						<TextField
							{...params}
							label="استاد"
						/>
					)}
				/>
			</div>
			<CalendarView events={events} />
		</Root>
	);
}

export default CalendarApp;
