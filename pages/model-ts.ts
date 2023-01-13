import { z } from "zod";

// User model and schema
export interface user {
  _id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const User = z.object({
  _id: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string().optional(),
});
