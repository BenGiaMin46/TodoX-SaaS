import axios from 'axios';

export const BASE_URL = import.meta.env.MODE === 'production' 
    ? '' // In production, frontend is served by backend, so relative path works
    : 'http://127.0.0.1:5005';

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        // Axios will automatically set headers based on the body type
    }
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== 'undefined') {
                const user = JSON.parse(storedUser);
                const token = user?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.error("API Interceptor Error:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
