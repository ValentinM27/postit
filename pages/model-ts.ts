import { z } from "zod";

// User model and schema
export interface user {
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
}

export const User = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  password: z.string(),
});
