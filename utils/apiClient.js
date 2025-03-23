import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000', // Replace with actual backend URL or IP if using Expo Go
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = '<your-token>'; // Replace with token logic when available
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
