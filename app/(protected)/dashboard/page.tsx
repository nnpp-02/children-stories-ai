import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { authCheckAction } from "@/actions/auth";

export default async function DashboardPage() {
  const { user } = await authCheckAction();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || user?.email}!
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Create a Story"
          description="Generate a new AI-powered children's story"
          linkHref="/create-story"
          linkText="Create Now"
          colorClass="bg-gradient-to-br from-purple-500 to-indigo-600"
        />
        <DashboardCard
          title="My Stories"
          description="View and manage your created stories"
          linkHref="/my-stories"
          linkText="View All"
          colorClass="bg-gradient-to-br from-pink-500 to-rose-600"
        />
        <DashboardCard
          title="Account Settings"
          description="Update your profile and preferences"
          linkHref="/settings"
          linkText="Settings"
          colorClass="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 text-center text-gray-500">
            No recent activity found. Start by creating your first story!
          </div>
        </div>
      </div>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  description: string;
  linkHref: string;
  linkText: string;
  colorClass: string;
};

const DashboardCard = ({
  title,
  description,
  linkHref,
  linkText,
  colorClass,
}: DashboardCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <div className={`h-2 ${colorClass}`}></div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        <div className="mt-6">
          <Link
            href={linkHref}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
          >
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
};
