import { z } from 'zod';
import { loginSchema, signupSchema } from '../schemas/user.schema.js';
import { Provider, Role } from './enum.user.js';

export type LoginFormData = z.infer<typeof loginSchema>;

export type SignupFormData = z.infer<typeof signupSchema>;

export type User = {
  username: string;
  email: string;
  imgUrl: string | null;
  role: Role;
  password: string | null;
  githubId: string | null;
  googleId: string | null;
  provider: Provider;
  dob: string | null;
};

export type UserBasic = Omit<User, 'password' | 'googleId' | 'githubId' | 'provider' | 'dob'> & {
  id: string;
}