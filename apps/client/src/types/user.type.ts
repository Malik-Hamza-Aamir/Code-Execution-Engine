import { z } from 'zod';
import { SignupSchema } from '../schemas/member.schema';

export type SignupFormData = z.infer<typeof SignupSchema>;

export type NewUserRegistration = Omit<SignupFormData, 'confirmPassword' | 'dateOfBirth' > & {
  dob: string;
};
