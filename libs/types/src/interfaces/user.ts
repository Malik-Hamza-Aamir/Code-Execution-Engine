import { z } from "zod";
import { loginSchema, signupSchema } from "src/schemas/user.schema";

export type LoginFormData = z.infer<typeof loginSchema>;

export type SignupFormData = z.infer<typeof signupSchema>;