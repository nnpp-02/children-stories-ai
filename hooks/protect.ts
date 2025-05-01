import { redirect } from "next/navigation";
import { authCheckAction } from "@/actions/auth";

export async function protectPage() {
  const { loggedIn, user } = await authCheckAction();

  if (!loggedIn) {
    redirect("/login");
  }

  return { user };
}

export async function protectAdmin() {
  const { loggedIn, user } = await authCheckAction();

  if (!loggedIn) {
    redirect("/login");
  }

  if (user?.role !== "ADMIN") {
    redirect("/not-authorized");
  }

  return { user };
}
