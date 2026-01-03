import {create} from "zustand";

const useAuthStore = create((set) => ({
    userId: null,
    username: null,
    email: null,
    isAuthenticated: false,

    setAuth: ({userId, username, email}) => set({
        userId,
        username,
        email,
        isAuthenticated: true,
    }),

    logout: () => set({
        userId: null,
        username: null,
        email: null,
        isAuthenticated: false
    }),
}));

export default useAuthStore;