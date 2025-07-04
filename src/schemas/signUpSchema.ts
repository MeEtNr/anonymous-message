import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast two characters")
  .max(20, "Username must be maximum of twenty characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain any special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "password must be atleast 8 characters" })
    .max(16, { message: "password must be maximum of 16 characters" }),
});
