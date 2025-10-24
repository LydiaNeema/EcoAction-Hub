"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/authService";
import { setToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return setError("Please enter your email address");
    if (!password.trim()) return setError("Please enter your password");

    setLoading(true);
    setError("");
    try {
      const { token } = await authService.login({ email, password });
      setToken(token);
      router.push("/dashboard");
    } catch (err) {
      if (err.message.includes("Invalid credentials")) {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Sign in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F1FFF6] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Branding */}
        <div className="flex flex-col items-center text-center mb-8">
  <div className="flex items-center gap-2 mb-1">
    <Image src="/EcoActionlogo.png" width={32} height={32} alt="EcoAction Logo" />
    <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
  </div>
  <p className="text-gray-600 text-sm -mt-1">Sign in to continue making an impact</p>
</div>


        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
        >
          {/* Email */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full mb-5 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Password with Toggle */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

          {/* Forgot Password Link */}
          <div className="text-right mt-2">
            <Link href="/auth/forgot-password" className="text-green-700 text-sm font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full mt-6 bg-[#16A34A] text-white py-3 rounded-xl font-medium hover:bg-[#15803D] transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full bg-white border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <Image src="/google.svg" alt="google" width={20} height={20} />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>
        </form>

        {/* Footer CTA */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-green-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
        
      </div>
    </main>
  );
}
