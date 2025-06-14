import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val);
    const now = new Date();
    const minDate = new Date(
      now.getFullYear() - 100,
      now.getMonth(),
      now.getDate()
    );
    const maxDate = new Date(
      now.getFullYear() - 13,
      now.getMonth(),
      now.getDate()
    );
    return date >= minDate && date <= maxDate;
  }, 'You must be at least 13 years old and not older than 100 years'),
});
