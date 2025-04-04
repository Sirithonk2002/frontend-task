"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Backend URL: ", process.env.NEXT_PUBLIC_BACKEND_API_URL);
  
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL; 
  
    try {
      const res = await fetch(`${backendUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Login failed");
      }
  
      const { access_token } = await res.json();
      localStorage.setItem("token", access_token);
      router.push("/Tasks");
    } catch (err) {
      setError(err.message);
    }
  };
  
  

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8"
      style={{ background: "linear-gradient(to bottom right, #FF6666, #FFDAB9, #ffffff)" }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white/90 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full space-y-6 border border-rose-200"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 tracking-tight">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition cursor-pointer"
        >
          Login
        </button>

        <p className="mt-2 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/Register"
            className="text-rose-600 font-medium hover:underline"
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
