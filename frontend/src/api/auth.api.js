import api from '../utils/axiox';

export const loginApi = (data) => {
    return api.post('/auth/login', data);
}

export const signupApi = (data) => {
    return api.post('/auth/signup', data);
}