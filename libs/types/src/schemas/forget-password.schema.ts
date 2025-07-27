import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4, 'OTP must be at least 4 characters'),
});

export const resetSchema = z
  .object({
    email: z.string().email(),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Weak password'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
