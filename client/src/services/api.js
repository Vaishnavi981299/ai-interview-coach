import axios from 'axios';
const API = axios.create({
    baseURL: ' https://ai-interview-coach-backend-jmhb.onrender.com/api'
});
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const startSession = (data) => API.post('/interview/start', data);
export const answerQuestion = (data) => API.post('/interview/answer', data);
export const getSession = (sessionId) => API.get(`/interview/session/${sessionId}`);
