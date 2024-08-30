import React, { useState } from "react";
import RentLogo from "../img/LJA_icon.svg";

const Login = () => {
  return (
<div className="flex min-h-screen bg-background">
          <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-500">
            <div className="text-white text-4xl font-bold">
              Build like a team
              <br />
              of hundreds_
            </div>
          </div>
          <div className="w-full max-w-md p-8 space-y-6 lg-card rounded-lg shadow-md z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Rent-Connect"
            src={RentLogo}
            className="mx-auto h-auto w-auto"
          />
          <h2 className=" text-center text-3xl font-extrabold leading-9 tracking-tight text-gray-900">
            Admin Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="•••••••••••"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <FaEye className="h-5 w-5 text-black" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5 text-black" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-primary border rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-muted-foreground"
                  >
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {/* Add any additional content here */}
          </p>
        </div>
      </div>
        </div>
  );
};

export default Login;
