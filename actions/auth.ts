"use server";

import prisma from "@/lib/db";
import {
  hashPassword,
  comparePassword,
  generateToken,
  setAuthCookie,
  getAuthToken,
  verifyToken,
  deleteAuthCookie,
} from "@/lib/utils/auth";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations/auth";
import { ZodError } from "zod";

/**
 * Check if the user is authenticated
 */
export async function authCheckAction() {
  const token = await getAuthToken();

  if (!token) {
    return { user: null, loggedIn: false };
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      return { user: null, loggedIn: false };
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return { user: null, loggedIn: false };
    }

    return { user, loggedIn: true };
  } catch (error) {
    console.error("Auth check error:", error);
    return { user: null, loggedIn: false };
  }
}

/**
 * Login with email and password
 * If user doesn't exist, create a new account
 */
export async function loginOrRegisterAction(formData: LoginInput | FormData) {
  try {
    // Parse and validate input data
    const data =
      formData instanceof FormData
        ? registerSchema.parse({
            email: formData.get("email"),
            password: formData.get("password"),
            name: formData.get("name"),
          })
        : loginSchema.parse(formData);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      // Login flow
      const isPasswordValid = await comparePassword(
        data.password,
        existingUser.password
      );

      if (!isPasswordValid) {
        return { error: "Invalid password", loggedIn: false };
      }

      // Generate token and set cookie
      const token = generateToken({
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name || undefined,
        role: existingUser.role,
      });

      setAuthCookie(token);

      return {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
        },
        loggedIn: true,
      };
    } else {
      // Register flow
      const hashedPassword = await hashPassword(data.password);

      const newUser = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: (data as RegisterInput).name || data.email.split("@")[0],
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      // Generate token and set cookie
      const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name || undefined,
        role: newUser.role,
      });

      setAuthCookie(token);

      return {
        user: newUser,
        loggedIn: true,
      };
    }
  } catch (error) {
    console.error("Login/Register error:", error);

    if (error instanceof ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return { error: errorMessage, loggedIn: false };
    }

    return { error: "An unexpected error occurred", loggedIn: false };
  }
}

/**
 * Logout user by deleting the auth cookie
 */
export async function logoutAction() {
  try {
    const token = getAuthToken();

    if (!token) {
      return { message: "No active session found" };
    }

    deleteAuthCookie();
    return { message: "Successfully logged out" };
  } catch (error) {
    console.error("Logout error:", error);
    return { error: "An error occurred during logout", message: null };
  }
}
