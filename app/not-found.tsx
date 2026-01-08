import React from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-160  p-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h1 className="text-6xl font-bold text-gray-800 dark:text-[white]">404</h1>
        <p className="text-xl text-gray-600 dark:text-[white]">
          Oops! Page not found.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
