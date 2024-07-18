import { lazy, memo, Suspense } from 'react';

const QuickPanel = lazy(() => import('app/theme-layouts/shared-components/quickPanel/QuickPanel'));

/**
 * The right side layout 1.
 */
function RightSideMainLayout() {
	return (
		<Suspense>
			<QuickPanel />
		</Suspense>
	);
}

export default memo(RightSideMainLayout);
