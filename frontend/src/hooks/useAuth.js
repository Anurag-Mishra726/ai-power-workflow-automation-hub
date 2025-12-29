import {useMutation} from '@tanstack/react-query';
import {loginApi, signupApi} from '../api/auth.api';

export const useLogin = () => {
    return useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            console.log("login success:", data);
            //localStorage.setItem('token', data.token);
        }
    })
}

export const useSignup = () => {
    return useMutation({
        mutationFn: signupApi,
        onSuccess: (data) => {
            console.log("signup success:", data);
            //localStorage.setItem('token', data.token);
        }
    })
}