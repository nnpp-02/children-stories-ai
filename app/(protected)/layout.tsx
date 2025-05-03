import { protectPage } from "@/components/protect";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will protect all routes under this layout
  // and redirect to login if not authenticated
  await protectPage();

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
