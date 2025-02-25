"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignupOrLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    console.log("Attempting signup/login with:", email, password);
  
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
  
    // First, check if the email already exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();
  
    if (fetchError && fetchError.code !== "PGRST116") {
      setError(fetchError.message);
      return;
    }
  
    if (existingUser) {
      // Email exists, log in
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
  
      if (loginError) {
        setError(loginError.message);
      } else {
        router.push("/dashboard");
      }
    } else {
      // Email does not exist, sign up
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSignupOrLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-orange-500 mb-6">Sign Up / Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
