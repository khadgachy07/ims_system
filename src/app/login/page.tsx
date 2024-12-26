"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear error message on component mount
    setError(null);
    localStorage.clear();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setError(null);

    try {
      // Replace with your actual API call
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      const {token} = data
      localStorage.setItem("authToken", token);
      window.location.href = "/idea"; // Example redirection
      
    } catch (error) {
      setError((error as Error).message);
    }
  }
  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex flex-col items-center mb-4">
            <Image
              src="/logo.png"
              alt="GreenFuture Logo"
              width={250}
              height={250}
            />
            <h2 className=" text-center text-3xl font-extrabold text-teal-600">
              Login to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-100">
              Or{" "}
              <a
                href="/signup"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Sign Up your account
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-medium text-gray-100"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 sm:text-lg"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-100"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 sm:text-lg"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-teal-600 px-4 py-2 text-lg font-semibold text-white shadow-md hover:bg-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
