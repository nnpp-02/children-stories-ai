"use client";

import { Button } from "@/components/ui/button";
import {
  type ColorTheme,
  COLOR_VARIANTS,
  DEFAULT_THEME,
} from "@/constants/theme";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useAuth } from "@/contexts/auth-context";
import {
  LogIn,
  LogOut,
  Search,
  User,
  BookOpen,
  Settings,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MainMenuProps = {};

export default function MainMenu({}: MainMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedColor] = useLocalStorage<ColorTheme>(
    "book-color-theme",
    DEFAULT_THEME
  );
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  // Get current theme classes
  const theme = COLOR_VARIANTS[selectedColor];

  // Prevent hydration mismatch by only rendering after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const isAdmin = user?.role === "admin";

  if (!mounted) return null;

  return (
    <header className="w-full py-4 px-6 sm:px-8 md:px-12 flex justify-between items-center border-b border-muted shadow-sm backdrop-blur-sm bg-background/95 fixed top-0 left-0 right-0 z-50">
      <Link
        href="/"
        className="flex items-center gap-3 hover:opacity-90 transition-opacity"
      >
        <div className="relative h-12 w-12 md:h-14 md:w-14">
          <Image
            src="/images/logo.png"
            alt="AI Kids Book"
            width={56}
            height={56}
            className="object-contain"
            priority
            unoptimized
          />
        </div>
        <h1
          className={`text-xl md:text-2xl font-bold tracking-tight ${theme.text}`}
        >
          <span className="text-primary">AI</span> Kids Book
        </h1>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {isLoggedIn && (
          <Link
            href="/dashboard/generate-book"
            className={`font-medium text-base ${theme.text} hover:text-primary transition-colors flex items-center gap-1`}
          >
            <PlusCircle className="h-4 w-4" />
            Create Story
          </Link>
        )}

        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              className={`font-medium text-base ${theme.text} hover:text-primary transition-colors`}
            >
              Dashboard
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`font-medium text-base ${theme.text} hover:text-primary transition-colors`}
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className={`font-medium text-base ${theme.text} hover:text-primary transition-colors`}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className={`font-medium text-base ${theme.text} hover:text-primary transition-colors`}
          >
            Login
          </Link>
        )}

        <Link
          href="/search"
          className={`font-medium text-base ${theme.text} hover:text-primary transition-colors`}
        >
          Search
        </Link>
      </nav>

      <div className="flex md:hidden items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/search">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Link>
        </Button>

        {isLoggedIn ? (
          <>
            {isLoggedIn && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/generate-book">
                  <PlusCircle className="h-5 w-5" />
                  <span className="sr-only">Create Story</span>
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <User className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </Button>
            {isAdmin && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Admin</span>
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <LogIn className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
