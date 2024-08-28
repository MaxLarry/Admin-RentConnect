import React, { useState } from "react";
import RentLogo from "../img/rentconff1.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex min-h-screen text-slate-100">
      <div className="flex-1 flex py-20 bg-gradient-to-r from-pink-500 to-red-500">
        <div className="px-16">
        <img
              alt="Rent-Connect"
              src={RentLogo}
              className="mx-auto h-11 w-auto"
            />
        </div>
      </div>
      <div className="flex-1 flex-col flex p-5 items-center justify-center bg-zinc-900">
        <div className="w-full max-w-md space-y-6">
          <div className="mb-9">

            <h2 className="text-2xl font-bold">
              Admin Login
            </h2>
          </div>

          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium"
              >
                Email address<span className="text-rose-600">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-zinc-800 border-zinc-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                >
                  Password<span className="text-rose-600">*</span>
                </label>
              </div>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="•••••••••••"
                  className="block w-full rounded-md  bg-zinc-800 border-zinc-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <FaEye className="h-5 w-5 text-zinc-400" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5 text-zinc-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4  border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm  hover:underline">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
