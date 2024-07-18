import { QueryClientConfig } from '@tanstack/react-query';

const reactQueryConfig: QueryClientConfig = {
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1
		}
	}
};

export default reactQueryConfig;
