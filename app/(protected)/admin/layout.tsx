import { protectAdmin } from "@/components/protect";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will protect all admin routes and redirect to dashboard if not an admin
  await protectAdmin();

  return (
    <div className="min-h-screen">
      <div className="bg-purple-900 py-2 px-4 text-center text-white text-sm">
        Admin Access - This area requires elevated permissions
      </div>
      {children}
    </div>
  );
}
