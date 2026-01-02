import {z} from "zod";

export const signupSchema = z
.object({
    username: z.string()
                .min(2, "Username is too short!")
                .max(15, 'Username too long (max 20 chars)')
                .regex(/^[a-zA-Z\s]+$/, 'Username must contain only letters and spaces'),
    email: z.string().email("Invalid email address!"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})