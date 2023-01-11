import { z } from "zod";

// User model and schema
export interface user {
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
}

export const User = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string(),
  password: z.string(),
});
