import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import reactQueryConfig from './reactQueryConfig';

const queryClient = new QueryClient(reactQueryConfig);

interface IProps {
	children: ReactNode;
}

function ReactQueryProvider({ children }: IProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			{children}
		</QueryClientProvider>
	);
}

export default ReactQueryProvider;
