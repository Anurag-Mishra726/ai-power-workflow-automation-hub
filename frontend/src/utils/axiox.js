import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type' : 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use( config => {
    const token = Cookies.get('token');
    
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    }

    return config;
});

api.interceptors.response.use(
    response => response,

    error => {
        const message = error.response?.data?.message || "Some thing went wrong";
        return Promise.reject(message);
    }
    
)

export default api;