import { z } from 'zod';

export const requiredBody= z.object({
    username: z.string().min(3, "username should be atleast 3 letters").max(10, "username should not exceed 10 characters"),
    password: z.string().min(8, "password should be atleast 8 letters").max(20, "password should not exceed 20 characters").regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one digit."
    )
})


export type UserSchema=z.infer<typeof requiredBody>;