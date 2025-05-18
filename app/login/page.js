"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  // Authority credentials from environment variables
  const AUTH_USERNAME = process.env.NEXT_PUBLIC_AUTH_USERNAME;
  const AUTH_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD;

  function validate(values) {
    const errs = {};
    if (!values.username) errs.username = "Username is required";
    if (!values.password) errs.password = "Password is required";
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });
  }

  function handleBlur(e) {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(
      validate({
        ...form,
        [e.target.name]: e.target.value,
      })
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    const validation = validate(form);
    setErrors(validation);
    setTouched({ username: true, password: true });
    setSubmitted(true);

    if (Object.keys(validation).length === 0) {
      setLoading(true);
      try {
        // Compare with .env.local credentials
        if (
          form.username === AUTH_USERNAME &&
          form.password === AUTH_PASSWORD
        ) {
          setApiError("");
          setSubmitted(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else {
          alert(form.username);
          alert(AUTH_USERNAME);
          setApiError("Invalid credentials.");
        }
      } catch (err) {
        setApiError("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div >
      <div className="flex h-screen bg-gray-100 dark:bg-zinc-900 transition-colors">
        {/* Theme Switcher */}
        
        {/* Left Pane */}
        <div className="hidden lg:flex items-center justify-center flex-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">
          <div className="max-w-md text-center">
            {/* Illustration */}
            <svg xmlns="http://www.w3.org/2000/svg" width="524.67" height="531.4" className="w-full" viewBox="0 0 524.67 531.4">
              <rect width="100%" height="100%" fill="none"/>
              <text x="50%" y="50%" textAnchor="middle" fill="#a3a3a3" fontSize="32" dy=".3em">Authority Login</text>
            </svg>
          </div>
        </div>
        {/* Right Pane */}
        <div className="w-full bg-gray-100 dark:bg-zinc-900 lg:w-1/2 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-2 text-zinc-900 dark:text-white text-center">Authority Login</h1>
            <h2 className="text-sm font-semibold mb-6 text-gray-600 dark:text-zinc-400 text-center">
              Please enter your authority credentials
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-zinc-800 dark:text-zinc-300">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 p-2 w-full border rounded-md focus:border-gray-300 dark:focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-zinc-700 transition-colors duration-300 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ${
                    errors.username && touched.username ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-zinc-700"
                  }`}
                />
                {errors.username && touched.username && (
                  <span className="text-xs text-red-500 dark:text-red-400">{errors.username}</span>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-800 dark:text-zinc-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 p-2 w-full border rounded-md focus:border-gray-300 dark:focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-zinc-700 transition-colors duration-300 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ${
                    errors.password && touched.password ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-zinc-700"
                  }`}
                />
                {errors.password && touched.password && (
                  <span className="text-xs text-red-500 dark:text-red-400">{errors.password}</span>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-black dark:bg-zinc-200 text-white dark:text-black p-2 rounded-md hover:bg-gray-800 dark:hover:bg-zinc-100 focus:outline-none focus:bg-black dark:focus:bg-zinc-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-zinc-700 transition-colors duration-300"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
            {apiError && (
              <span className="block text-red-500 dark:text-red-400 text-sm mt-2 text-center">{apiError}</span>
            )}
            {submitted && !apiError && Object.keys(errors).length === 0 && (
              <span className="block text-green-600 dark:text-green-400 text-sm mt-4 text-center">
                Login successful! Redirecting...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}