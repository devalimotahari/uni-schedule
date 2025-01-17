import PageTemplate from 'app/shared-components/PageTemplate';
import { ISolverResult } from 'app/services/responseTypes';
import { useCalendarStore } from 'app/store/calendarStore';
import Button from '@mui/material/Button';
import SolverSettingFormDialog from './SolverSettingFormDialog';
import CalendarApp from './CalendarApp';
import SolveResultList from './SolveResultList';

function CalendarPage() {
	const [resultId, setResultId] = useCalendarStore((s) => [s.selectedResultId, s.setSelectedResultId]);

	return (
		<PageTemplate<ISolverResult>
			title="تقویم برنامه درسی"
			createTitle={!resultId ? 'پردازش برنامه جدید بر اساس داده‌های وارد شده' : undefined}
			formDialog={SolverSettingFormDialog}
			titleEndElement={
				resultId ? (
					<Button
						onClick={() => {
							setResultId(null);
						}}
						variant="text"
						size="small"
						color="primary"
					>
						بازگشت به لیست
					</Button>
				) : undefined
			}
		>
			{resultId && <CalendarApp />}
			{!resultId && <SolveResultList />}
		</PageTemplate>
	);
}

export default CalendarPage;
