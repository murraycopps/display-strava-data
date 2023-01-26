import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-white bg-gray-800">
      <h1 className="flex items-end font-medium text-left text-8xl">
        Strava Data Display
      </h1>
      <p className="flex items-center mb-20 text-lg text-left">
        Our website allows you to easily view and analyze your Strava data,
        including your activity history, progress, and performance metrics.
      </p>
      <div className="grid grid-cols-2 gap-8">
        <Link
          href="/create-account"
          className="px-16 py-2 mt-4 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Register
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 mt-4 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
