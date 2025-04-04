"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); 

    try {
      const res = await fetch("https://backend-task-ra57.onrender.com/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Registration failed");
      }

      const { access_token } = await res.json();
      localStorage.setItem("token", access_token);
      
      setSuccessMessage("Registration successful!"); 
      setTimeout(() => {
        router.push("/Login"); 
      }, 2000); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(to bottom right, #FF6633, #FFD1A9, #FFF8F2)",
      }}
    >
      <form
        onSubmit={handleRegister}
        className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md w-full space-y-6 border border-orange-200"
      >
        <h2 className="text-4xl font-extrabold text-center text-gray-800 tracking-tight">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="text-green-600 text-sm text-center font-medium mt-4">
            {successMessage}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition cursor-pointer"
        >
          Register
        </button>

        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/Login"
            className="text-orange-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
