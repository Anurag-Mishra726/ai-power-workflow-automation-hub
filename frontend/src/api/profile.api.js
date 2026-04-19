import api from '../utils/axiox';

export const getProfileApi = () => api.get('/user/profile');

export const deleteProfileApi = () => api.delete('/user/profile');
