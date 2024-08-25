import React, { useState } from "react";
import RentLogo from "../img/LJA_icon.svg";

const Login = () => {
  return (
    <div class="flex items-center justify-center min-h-screen bg-background">
      <div class="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md">
        <div class="flex justify-center">
          <img
            aria-hidden="true"
            alt="logo"
            src="https://openui.fly.dev/openui/24x24.svg?text=🔒"
            class="w-12 h-12"
          />
        </div>
        <h2 class="text-2xl font-semibold text-center text-foreground">
          Sign in to your account
        </h2>
        <form class="space-y-4">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-muted-foreground"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              required
              class="block w-full p-2 border border-border rounded-md focus:outline-none focus:ring focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-muted-foreground"
            >
              Password
            </label>
            <div class="relative">
              <input
                type="password"
                id="password"
                required
                class="block w-full p-2 border border-border rounded-md focus:outline-none focus:ring focus:ring-ring"
                placeholder="••••••••"
              />
              <button
                type="button"
                id="togglePassword"
                class="absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12a3 3 0 116 0 3 3 0 01-6 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="remember"
                class="h-4 w-4 text-primary border-border rounded focus:ring focus:ring-ring"
              />
              <label for="remember" class="ml-2 text-sm text-muted-foreground">
                Remember me
              </label>
            </div>
            <a href="#" class="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            class="w-full bg-primary text-primary-foreground hover:bg-primary/80 p-2 rounded-md"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
