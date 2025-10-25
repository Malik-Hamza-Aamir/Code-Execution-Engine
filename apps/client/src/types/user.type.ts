import { z } from 'zod';
import { SignupSchema, LoginSchema } from '../schemas/member.schema';

export type SignupFormData = z.infer<typeof SignupSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;

export type NewUserRegistration = Omit<SignupFormData, 'confirmPassword' | 'dateOfBirth' > & {
  dob: string;
};
