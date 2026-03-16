import { z } from "zod";

export const questionSchema = z.object({
  content: z
    .string()
    .min(5, { message: "Question must be at least 5 characters" })
    .max(500, { message: "Question must be no more than 500 characters" }),
});
