import z from "zod";

export const profileSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.email(),
  full_name: z.string(),
  phone: z.string(),
  address: z.string(),
  profile_picture: z.url(),
});
export type Profile = z.infer<typeof profileSchema>;

export const loginDataSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginData = z.infer<typeof loginDataSchema>;

export const forgotPasswordDataSchema = z.object({
  identifier: z.string().min(1, "Username is required"),
});
export type ForgotPasswordData = z.infer<typeof forgotPasswordDataSchema>;

export const resetPasswordDataSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
export type ResetPasswordData = z.infer<typeof resetPasswordDataSchema>;

export const registerDataSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    full_name: z.string().optional(),
    email: z.email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterData = z.infer<typeof registerDataSchema>;
