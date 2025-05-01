import Link from "next/link";

export default function NotAuthorizedPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-6">
        <svg
          className="h-14 w-14 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      </div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Access Denied</h1>
      <p className="mb-8 max-w-md text-gray-600">
        You do not have the necessary permissions to access this page. Please
        sign in with an account that has the required permissions.
      </p>
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-5 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
        >
          Sign In
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
