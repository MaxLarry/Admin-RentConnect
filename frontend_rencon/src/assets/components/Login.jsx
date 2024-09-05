import React, { useState } from "react";
import axios from "axios";
import RentLogo from "../img/rentconff1_white.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      //console.log("momomomomomo");
      await axios.post("/login", { email, password });
      //console.log("memeeammama");
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen text-slate-100">
      <div className="hidden lg:flex flex-1 py-20 bg-gradient-to-r log-img">
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
            <div className="px-16">
              <img
                alt="Rent-Connect"
                src={RentLogo}
                className="mx-auto h-11 w-auto mb-10 lg:hidden"
              />
            </div>
            <h2 className="text-2xl font-bold">Admin Login</h2>
          </div>

          {error && <div className="mb-4 text-red-600">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address<span className="text-rose-600">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-zinc-800 border-zinc-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-zinc-800 border-zinc-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="h-4 w-4 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm hover:underline">
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
