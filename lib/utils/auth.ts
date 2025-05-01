import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Compare a password with a hashed password
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a JWT token
 */
export const generateToken = (payload: {
  id: string;
  email: string;
  name?: string;
  role: string;
}) => {
  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new Error("JWT_SECRET is not defined in environment variables");

  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

/**
 * Get auth cookie options
 */
export const getAuthCookieOptions = (): Partial<ResponseCookie> => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  };
};

/**
 * Get the JWT token from cookies
 */
export const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("auth")?.value;
};

/**
 * Verify and decode JWT token
 */
export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new Error("JWT_SECRET is not defined in environment variables");

  try {
    return jwt.verify(token, secret) as {
      id: string;
      email: string;
      name?: string;
      role: string;
    };
  } catch (error) {
    return null;
  }
};
