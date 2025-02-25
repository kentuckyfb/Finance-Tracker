// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (activeTab === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (activeTab === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Container */}
      <div className="bg-gray-900 p-8 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-orange-500 mb-2">FinanceFlow</h1>
            <p className="text-gray-300">Streamline your purchase order management</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("login")}
              className={`px-4 py-2 text-lg ${
                activeTab === "login"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`px-4 py-2 text-lg ${
                activeTab === "signup"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            {activeTab === "signup" && (
              <div>
                <label className="block text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
            >
              {activeTab === "login" ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Orange Panel */}
      <div className="bg-orange-500 hidden lg:flex items-center justify-center p-8 min-h-screen">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-white mb-6">Welcome to FinanceFlow</h2>
          <p className="text-white/90 text-lg">
            Efficiently manage your purchase orders with our comprehensive tracking system. 
            Monitor status changes, automate renewals, and maintain a clear audit trail.
          </p>
        </div>
      </div>
    </div>
  );
}