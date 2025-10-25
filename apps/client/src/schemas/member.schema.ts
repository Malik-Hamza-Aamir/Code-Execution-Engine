import { z } from 'zod';

export const SignupSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
        'Password must include at least one number and one special character'
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    dateOfBirth: z.object({
      day: z.string().min(1, 'Select day'),
      month: z.string().min(1, 'Select month'),
      year: z.string().min(1, 'Select year'),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'Password must include at least one number and one special character'
    ),
});
