import axios from "axios";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-gray-800 h-screen text-white flex flex-col justify-center items-center gap-4">
      <h1 className="text-8xl font-medium text-left flex items-end">
        Strava Data Display
      </h1>
      <p className="text-lg text-left flex items-center mb-20">
        Our website allows you to easily view and analyze your Strava data,
        including your activity history, progress, and performance metrics.
      </p>
      <div className="grid grid-cols-2 gap-8">
        <Link
          href="/create-account"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-16 rounded-lg mt-4 text-center"
        >
          Register
        </Link>
        <Link
          href="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 text-center"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
