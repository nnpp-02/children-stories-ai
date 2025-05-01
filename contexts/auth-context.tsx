"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  authCheckAction,
  loginOrRegisterAction,
  logoutAction,
} from "@/actions/auth";
import { type LoginInput } from "@/lib/validations/auth";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (data: LoginInput) => Promise<{ error?: string }>;
  loginWithFormData: (formData: FormData) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, loggedIn } = await authCheckAction();
        setUser(user);
        setIsLoggedIn(loggedIn);
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginInput) => {
    try {
      const result = await loginOrRegisterAction(data);

      if (result.loggedIn && result.user) {
        setUser(result.user);
        setIsLoggedIn(true);
        return {};
      }

      return { error: result.error || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return { error: "An unexpected error occurred" };
    }
  };

  const loginWithFormData = async (formData: FormData) => {
    try {
      const result = await loginOrRegisterAction(formData);

      if (result.loggedIn && result.user) {
        setUser(result.user);
        setIsLoggedIn(true);
        return {};
      }

      return { error: result.error || "Login failed" };
    } catch (error) {
      console.error("Login with form data error:", error);
      return { error: "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    try {
      await logoutAction();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        login,
        loginWithFormData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
