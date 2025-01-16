import axios from 'axios';

if (!import.meta.env.VITE_API_URL) throw new Error('Please set VITE_API_URL env variable!');

declare module 'axios' {
	interface AxiosRequestConfig {
		urlParams?: Record<string, string | number>;
	}
}

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

const requestInterceptor = apiClient.interceptors.request.use(async (config) => {
	if (!config.url || !config.urlParams || Object.keys(config.urlParams).length === 0) {
		return config;
	}

	let currentUrl = config.url;
	// parse pathName to implement variables
	Object.entries(config.urlParams).forEach(([k, v]) => {
		currentUrl = currentUrl.replace(`{${k}}`, encodeURIComponent(v));
	});

	return {
		...config,
		url: currentUrl
	};
});

export const ejectBaseApiClientInterceptors = () => {
	apiClient.interceptors.request.eject(requestInterceptor);
};
