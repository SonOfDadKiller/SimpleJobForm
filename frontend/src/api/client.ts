import axios from 'axios';

const apiBase = process.env.REACT_APP_API_BASE_URL ?? '';

const api = axios.create({
    baseURL: `${apiBase}/api`,
});

// Interceptor: automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor: if we get a 401, the token expired - redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;