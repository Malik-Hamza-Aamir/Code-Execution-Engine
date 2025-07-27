import {
  emailSchema,
  otpSchema,
  resetSchema,
} from '../schemas/forget-password.schema.js';
import { z } from 'zod';

export type EmailType = z.infer<typeof emailSchema>;
export type OtpDtoType = z.infer<typeof otpSchema>;
export type ResetPwdType = z.infer<typeof resetSchema>;
