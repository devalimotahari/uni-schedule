import { Autocomplete } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useMutation } from '@tanstack/react-query';
import { PostCalculate } from 'app/services/apiShortRequests';
import { motion } from 'framer-motion';
import { useCalendarStore } from './calendarStore';
import { uuidv4 } from '../../utils/utils';

/**
 * The calendar header.
 */
function CalendarHeader() {
	const [professors, courses, results, selectedResultIndex, setResults, setSelectedResultIndex] = useCalendarStore(
		(state) => [
			state.professors,
			state.courses,
			state.results,
			state.selectedResultIndex,
			state.setResults,
			state.setSelectedResultIndex
		]
	);

	const { mutate: calculateMutate, isPending } = useMutation({
		mutationFn: PostCalculate,
		onSuccess: (res) => {
			if (res.data?.data?.resualts && res.data.data.resualts.length > 0) {
				setResults(
					res.data.data.resualts.map((item) => ({ ...item, id: uuidv4() })).sort((a, b) => a.score - b.score)
				);
				setSelectedResultIndex(0);
			}
		}
	});

	const sendDataToCalculate = () => {
		calculateMutate({
			settings: {},
			data: {
				professors: professors.map((prof) => ({
					id: prof.id,
					name: prof.name,
					days: prof.days.map(
						(d) => `${d.day}:${d.startTime.replace(/:/g, '')}:${d.endTime.replace(/:/g, '')}`
					),
					pref_days: prof.preferDays
				})),
				courses: courses.map((course) => ({
					id: course.id,
					name: course.name,
					semister: course.semester,
					units: course.unit,
					duration: course.duration.replace(/:/g, ''),
					professors: course.professors
				}))
			}
		});
	};

	return (
		<div className="flex flex-col md:flex-row w-full p-12 justify-between z-10 container">
			<div className="flex items-center justify-between gap-16">
				<Button
					onClick={sendDataToCalculate}
					disabled={professors.length === 0 || courses.length === 0 || isPending}
					variant="contained"
					color="secondary"
					className="rounded-lg"
				>
					شروع محاسبه برنامه
				</Button>
			</div>

			<motion.div
				className="flex items-center justify-end md:justify-center gap-16"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.3 } }}
			>
				{results.length > 0 && (
					<Autocomplete
						options={results}
						loading={isPending}
						fullWidth
						className="min-w-sm"
						getOptionLabel={(o) => `برنامه با امتیاز ${o.score} (شناسه: ${o.id})`}
						value={results[selectedResultIndex ?? 0] ?? null}
						onChange={(event, value) => {
							const foundIndex = results.findIndex((item) => item.id === value?.id);

							if (foundIndex !== -1) {
								setSelectedResultIndex(foundIndex);
							}
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								size="small"
								label="انتخاب برنامه پردازش شده"
							/>
						)}
					/>
				)}
			</motion.div>
		</div>
	);
}

export default CalendarHeader;
