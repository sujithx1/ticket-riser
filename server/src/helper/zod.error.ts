import z from "zod";

export const PrettierErorr = (error: z.ZodError) => {
  return error.issues.map((issue) => {
    const field = issue.path.join('.') || 'root';
    return `${field}: ${issue.message}`;
  })[0];
};