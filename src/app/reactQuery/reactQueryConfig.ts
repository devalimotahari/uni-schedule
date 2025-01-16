import { QueryClientConfig } from '@tanstack/react-query';

const reactQueryConfig: QueryClientConfig = {
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
			staleTime: 1000 * 60 * 5 // 5 minutes
		}
	}
};

export default reactQueryConfig;
