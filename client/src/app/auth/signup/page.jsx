"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/authService";
import { setToken } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (!agree) {
      setError("Please confirm you want to help your community");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const { token } = await authService.register({ full_name: fullName, email, password });
      setToken(token);
      router.push("/dashboard");
    } catch (err) {
      // Provide more user-friendly error messages
      if (err.message.includes("Email already registered")) {
        setError("This email is already registered. Please try signing in instead.");
      } else if (err.message.includes("Network error")) {
        setError("Unable to connect to server. Please check your internet connection and try again.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F1FFF6] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-2">
          <Image src="/EcoActionlogo.png" width={28} height={28} alt="logo" />
          <div>
            <p className="text-sm text-gray-700 leading-tight">EcoAction Hub</p>
            <h1 className="text-xl font-semibold -mt-1">Join Eco Action Hub</h1>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-600 mb-4">Start making a difference in your community</p>

          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Your name" className="w-full mb-4 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" />

          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full mb-4 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" />

          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" />

          <label className="flex items-center gap-2 text-sm text-gray-700 mt-4">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="rounded border-gray-300" />
            I want to help my community
          </label>

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

          <button disabled={loading} type="submit" className="w-full mt-6 bg-[#16A34A] text-white py-3 rounded-xl font-medium hover:bg-[#15803D] disabled:opacity-60">
            {loading ? "Creating..." : "Create Account"}
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <button type="button" className="w-full bg-white border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50">
            <Image src="/google.svg" alt="google" width={20} height={20} />
            <span className="text-gray-700">Continue with Google</span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-4">
          Already have an account ? <Link href="/auth/signin" className="text-green-600 font-medium">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
