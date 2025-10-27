"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/authService";
import { CheckCircle, Mail } from "lucide-react";

export default function ForgotPasswordRequestPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#F1FFF6] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              Check Your Email
            </h1>
            
            <p className="text-gray-600 mb-6">
              If an account with that email exists, we've sent you a password reset link.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-blue-800 text-sm font-medium mb-1">
                    Check your spam folder
                  </p>
                  <p className="text-blue-700 text-sm">
                    Sometimes emails end up in spam. If you don't see it in your inbox, check your spam folder.
                  </p>
                </div>
              </div>
            </div>
            
            <Link
              href="/auth/signin"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1FFF6] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Image src="/EcoActionlogo.png" width={40} height={40} alt="EcoAction Logo" />
            <h1 className="text-2xl font-semibold text-gray-900">Forgot Password</h1>
          </div>
          <p className="text-gray-600 text-sm -mt-1">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* Email */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 mb-4"
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#16A34A] text-white py-3 rounded-xl font-medium hover:bg-[#15803D] disabled:opacity-60 transition"
          >
            {loading ? "Sending Reset Link..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Sign In */}
        <div className="text-center mt-6">
          <Link 
            href="/auth/signin" 
            className="text-green-600 font-medium hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
