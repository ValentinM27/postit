import { z } from "zod";

// User model and schema
export interface user {
  _id?: string;
  login?: string;
  password?: string;
  confirmPassword?: string;
}

export const User = z.object({
  _id: z.string().optional(),
  login: z.string().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export interface book {
  title?: string;
  bookFile?: File | undefined;
  bookCover?: string | ArrayBuffer | null;
  ownerId?: string;
  uploadDate?: Date;
  shared?: boolean;
}

export const Book = z.object({
  _id: z.string().optional(),
  title: z.string().optional(),
  shared: z.boolean().optional(),
});

export interface bookref {
  title?: string;
  ownerId?: string;
  cover?: string;
  filename?: string;
  uploadDate?: Date;
  shared?: boolean;
  epubcfi?: string;
}

export const Epubcfi = z.object({
  epubcfi: z.string(),
});
