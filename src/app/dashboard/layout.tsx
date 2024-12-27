"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname()
  const isProfilePage = pathname === "/dashboard/profile"; // Check if the current route is /dashboard/profile

  return (
    <div className="flex flex-col min-h-screen  text-teal-300">
      {/* Navbar */}
      <header className=" text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          {/* Left Side */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div>
              <Image
                src="/logo.png" // Replace with the actual path to your logo
                alt="Logo"
                width={60} // Set the width of the logo
                height={32} // Set the height of the logo
                className="object-contain" // Ensures the logo scales properly
              />
            </div>
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-4">
              <a href="/dashboard/idea" className="hover:text-teal-300 transition duration-200 text-md">
                Idea Dashboard
              </a>
              <a href="/dashboard/submission" className="hover:text-teal-300 transition duration-200">
                Submission
              </a>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center">
            {/* Conditional rendering of Profile or Logout */}
            {isProfilePage ? (
              <button
                onClick={() => {
                  // Handle logout logic here (e.g., call an API, clear cookies, etc.)
                  router.push("/login"); // Redirect to logout page or call a logout function
                }}
                className="hover:text-teal-300 transition duration-200 text-md text-white"
              >
                Logout
              </button>
            ) : (
              <a
                href="/dashboard/profile"
                className="hover:text-teal-300 transition duration-200"
              >
                <Image
                  src="/profile.png"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full border border-white"
                />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-teal-500 text-white">
        <div className="container mx-auto px-4 py-3 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}