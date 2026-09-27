import { z } from "zod";

// Username Validation
export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must not exceed 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers and underscore",
  );

// Email Validation
export const emailValidation = z
  .string()
  .email("Please enter a valid email address")
  .toLowerCase()
  .trim();

// Password Validation
export const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(50, "Password must not exceed 50 characters");

// Verification Code Validation
export const verifyCodeValidation = z
  .string()
  .length(6, "Verification code must be 6 characters")
  .regex(/^[0-9]+$/, "Verification code must contain only numbers");

// Signup Schema
export const signupSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});

// Signin Schema
export const signinSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

// Verify User Schema
export const verifySchema = z.object({
  email: emailValidation,
  verifycode: verifyCodeValidation,
});
