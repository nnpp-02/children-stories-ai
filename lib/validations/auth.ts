import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = loginSchema.extend({
  name: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
