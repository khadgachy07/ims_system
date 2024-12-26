"use client";

import React from "react";
import Image from "next/image";

export default function SignUpForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [error, setError] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const result = await response.json();
      console.log("User created:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred while submitting the form.");
    }
  };

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
            <h2 className="text-center text-3xl font-extrabold text-teal-600">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-100">
              Or{" "}
              <a
                href="/login"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                sign in to your account
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
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
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
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 sm:text-lg"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
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

            <div>
              <label
                htmlFor="passwordConfirmation"
                className="block text-lg font-medium text-gray-100"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  value={formData.passwordConfirmation}
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
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
