import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { MobileTimePicker } from '@mui/x-date-pickers';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { IProfessor } from '../../calendarStore';
import { commonTimePickerProps, parseDateToTimeFormat, parseTimeFormatToDate, weekDays } from '../../utils';

interface IProps {
	formControl: Control;
}

function ProfessorDaysForm({ formControl }: IProps) {
	const { fields, append, remove } = useFieldArray({
		control: formControl as unknown as Control<IProfessor>,
		name: 'days'
	});

	return (
		<Box className="flex flex-col gap-10 w-full">
			<FormLabel>ساعات تدریس</FormLabel>
			{fields.map((field, i) => (
				<Box
					key={field.id}
					className="flex items-center gap-8 w-full"
				>
					<Controller
						control={formControl}
						name={`days.${i}.day`}
						render={({ field, fieldState }) => (
							<FormControl fullWidth>
								<InputLabel id="select-day-label">روز</InputLabel>
								<Select
									{...field}
									size="small"
									label="روز"
									error={!!fieldState.error}
									labelId="select-day-label"
								>
									{weekDays.map((day, i) => (
										<MenuItem
											value={i}
											key={i}
											className="space-x-12"
										>
											<span>{day}</span>
										</MenuItem>
									))}
								</Select>
								<FormHelperText error={!!fieldState.error}>{fieldState.error?.message}</FormHelperText>
							</FormControl>
						)}
					/>
					<Controller
						control={formControl}
						name={`days.${i}.startTime`}
						render={({ field, fieldState }) => (
							<MobileTimePicker
								{...field}
								{...commonTimePickerProps(fieldState)}
								value={parseTimeFormatToDate(field.value as string)}
								onChange={(value) => field.onChange(parseDateToTimeFormat(value))}
								label="ساعت شروع"
							/>
						)}
					/>
					<Controller
						control={formControl}
						name={`days.${i}.endTime`}
						render={({ field, fieldState }) => (
							<MobileTimePicker
								{...field}
								{...commonTimePickerProps(fieldState)}
								value={parseTimeFormatToDate(field.value as string)}
								onChange={(value) => field.onChange(parseDateToTimeFormat(value))}
								label="ساعت پایان"
							/>
						)}
					/>
					<Box className="mx-5 flex gap-4">
						<IconButton onClick={() => append({ day: 0, startTime: '', endTime: '' })}>
							<FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>
						</IconButton>
						<IconButton onClick={() => remove(i)}>
							<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
						</IconButton>
					</Box>
				</Box>
			))}
		</Box>
	);
}

export default ProfessorDaysForm;
