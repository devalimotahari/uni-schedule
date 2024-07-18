import axios from 'axios';

if (!import.meta.env.VITE_API_URL) throw new Error('Please set VITE_API_URL env variable!');

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});
