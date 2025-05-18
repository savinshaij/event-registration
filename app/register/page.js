"use client";
import React, { useState } from "react";

const initialState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const passwordRules = [
  { regex: /.{8,}/, message: "At least 8 characters" },
  { regex: /[A-Z]/, message: "One uppercase letter" },
  { regex: /[a-z]/, message: "One lowercase letter" },
  { regex: /[0-9]/, message: "One number" },
  { regex: /[^A-Za-z0-9]/, message: "One special character" },
];

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function validate(values) {
    const errs = {};
    if (!values.username) errs.username = "Username is required";
    if (!values.email) errs.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email))
      errs.email = "Invalid email address";
    if (!values.password) errs.password = "Password is required";
    else {
      const failed = passwordRules.filter(rule => !rule.regex.test(values.password));
      if (failed.length)
        errs.password = "Password must have: " + failed.map(f => f.message).join(", ");
    }
    if (!values.confirmPassword) errs.confirmPassword = "Confirm your password";
    else if (values.password !== values.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  }

  function handleBlur(e) {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validate({ ...form, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    const validation = validate(form);
    setErrors(validation);
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    if (Object.keys(validation).length === 0) {
      setLoading(true);
      setSubmitted(false);
      try {
        
        const res = await fetch("https://6821acbc259dad2655b01e0b.mockapi.io/api/v1/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
          }),
        });
        if (!res.ok) throw new Error("Failed to register user");
        setSubmitted(true);
        setForm(initialState);
      } catch (err) {
        setApiError("Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-900 transition-colors">
      {/* Left Pane */}
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white dark:bg-zinc-800 text-black dark:text-white">
        <div className="max-w-md text-center">
          {/* Illustration */}
          <svg xmlns="http://www.w3.org/2000/svg" width="524.67" height="531.4" className="w-full" viewBox="0 0 524.67 531.4">
            {/* ...SVG content from your prompt... */}
            <rect width="100%" height="100%" fill="none"/>
            <text x="50%" y="50%" textAnchor="middle" fill="#a3a3a3" fontSize="32" dy=".3em">Register Illustration</text>
          </svg>
        </div>
      </div>
      {/* Right Pane */}
      <div className="w-full bg-gray-100 dark:bg-zinc-900 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <h1 className="text-3xl font-semibold mb-2 text-black dark:text-white text-center">Sign Up</h1>
          <h2 className="text-sm font-semibold mb-6 text-gray-500 dark:text-zinc-400 text-center">
            Join to Our Community with all time access and free
          </h2>
          <div className="mt-4 flex flex-col lg:flex-row items-center justify-between gap-2">
            <button
              type="button"
              className="w-full flex justify-center items-center gap-2 bg-white dark:bg-zinc-800 text-sm text-gray-600 dark:text-zinc-200 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-zinc-700 transition-colors duration-300"
              onClick={() => alert("Google sign up not implemented")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4">
                <path fill="#fbbb00" d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"></path>
                <path fill="#518ef8" d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"></path>
                <path fill="#28b446" d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"></path>
                <path fill="#f14336" d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"></path>
              </svg>
              Sign Up with Google
            </button>
            <button
              type="button"
              className="w-full flex justify-center items-center gap-2 bg-white dark:bg-zinc-800 text-sm text-gray-600 dark:text-zinc-200 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-zinc-700 transition-colors duration-300"
              onClick={() => alert("Github sign up not implemented")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-4">
                <path d="M7.999 0C3.582 0 0 3.596 0 8.032a8.031 8.031 0 0 0 5.472 7.621c.4.074.546-.174.546-.387 0-.191-.007-.696-.011-1.366-2.225.485-2.695-1.077-2.695-1.077-.363-.928-.888-1.175-.888-1.175-.727-.498.054-.488.054-.488.803.057 1.225.828 1.225.828.714 1.227 1.873.873 2.329.667.072-.519.279-.873.508-1.074-1.776-.203-3.644-.892-3.644-3.969 0-.877.312-1.594.824-2.156-.083-.203-.357-1.02.078-2.125 0 0 .672-.216 2.2.823a7.633 7.633 0 0 1 2.003-.27 7.65 7.65 0 0 1 2.003.271c1.527-1.039 2.198-.823 2.198-.823.436 1.106.162 1.922.08 2.125.513.562.822 1.279.822 2.156 0 3.085-1.87 3.764-3.652 3.963.287.248.543.738.543 1.487 0 1.074-.01 1.94-.01 2.203 0 .215.144.465.55.386A8.032 8.032 0 0 0 16 8.032C16 3.596 12.418 0 7.999 0z"></path>
              </svg>
              Sign Up with Github
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-zinc-400 text-center">
            <p>or with email</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 p-2 w-full border rounded-md focus:border-gray-200 dark:focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-zinc-700 transition-colors duration-300 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-100 ${
                  errors.username && touched.username ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-zinc-700"
                }`}
              />
              {errors.username && touched.username && (
                <span className="text-xs text-red-500">{errors.username}</span>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 p-2 w-full border rounded-md focus:border-gray-200 dark:focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-zinc-700 transition-colors duration-300 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-100 ${
                  errors.email && touched.email ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-zinc-700"
                }`}
              />
              {errors.email && touched.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 p-2 w-full border rounded-md focus:border-gray-200 dark:focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-zinc-700 transition-colors duration-300 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-100 ${
                  errors.password && touched.password ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-zinc-700"
                }`}
              />
              {errors.password && touched.password && (
                <span className="text-xs text-red-500">{errors.password}</span>
              )}
              {!errors.password && form.password && (
                <ul className="mt-2 ml-1 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                  {passwordRules.map(rule => (
                    <li
                      key={rule.message}
                      className={
                        rule.regex.test(form.password)
                          ? "text-green-600 dark:text-green-400"
                          : "text-zinc-400 dark:text-zinc-500"
                      }
                    >
                      {rule.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 p-2 w-full border rounded-md focus:border-gray-200 dark:focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-zinc-700 transition-colors duration-300 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-100 ${
                  errors.confirmPassword && touched.confirmPassword ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-zinc-700"
                }`}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <span className="text-xs text-red-500">{errors.confirmPassword}</span>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-black dark:bg-zinc-200 text-white dark:text-black p-2 rounded-md hover:bg-gray-800 dark:hover:bg-zinc-100 focus:outline-none focus:bg-black dark:focus:bg-zinc-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-zinc-700 transition-colors duration-300"
              >
                Sign Up
              </button>
            </div>
          </form>
          {apiError && (
            <span className="block text-red-500 text-sm mt-2 text-center">{apiError}</span>
          )}
          {loading && (
            <span className="block text-blue-500 text-sm mt-2 text-center">Registering...</span>
          )}
          {submitted && Object.keys(errors).length === 0 && (
            <span className="block text-green-600 dark:text-green-400 text-sm mt-4 text-center">Registration successful!</span>
          )}
          <div className="mt-4 text-sm text-gray-600 dark:text-zinc-400 text-center">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-black dark:text-white hover:underline">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}