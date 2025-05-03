import { protectAdmin } from "@/components/protect";
import { LogoutButton } from "@/components/logout-button";

export default async function AdminPage() {
  const { user } = await protectAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome, Admin {user?.name || user?.email}!
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminCard
          title="Manage Users"
          description="View and manage user accounts"
          colorClass="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <AdminCard
          title="Content Settings"
          description="Manage story content and moderation"
          colorClass="bg-gradient-to-br from-green-500 to-teal-600"
        />
        <AdminCard
          title="System Settings"
          description="Configure system and API settings"
          colorClass="bg-gradient-to-br from-orange-500 to-amber-600"
        />
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent System Activity
        </h2>
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    User Login
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    john.doe@example.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    5 minutes ago
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Story Created
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    alice.smith@example.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1 hour ago
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

type AdminCardProps = {
  title: string;
  description: string;
  colorClass: string;
};

const AdminCard = ({ title, description, colorClass }: AdminCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <div className={`h-2 ${colorClass}`}></div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        <div className="mt-6">
          <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition">
            Access
          </button>
        </div>
      </div>
    </div>
  );
};
