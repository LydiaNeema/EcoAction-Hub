"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
    }
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await authService.resetPassword({ token, password });
      setSuccess(true);
      
      // Redirect to signin after 3 seconds
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. The link may have expired.");
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
              Password Reset!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. Redirecting you to sign in...
            </p>
            
            <Link
              href="/auth/signin"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
            >
              Sign In Now
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
            <h1 className="text-2xl font-semibold text-gray-900">New Password</h1>
          </div>
          <p className="text-gray-600 text-sm -mt-1">
            Create a new password for your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* New Password */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative mb-4">
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

          {/* Confirm Password */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative mb-4">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <p className="text-gray-700 text-sm font-medium mb-2">Password must:</p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li className={password.length >= 6 ? "text-green-600" : ""}>
                • Be at least 6 characters long
              </li>
              <li className={password === confirmPassword && password ? "text-green-600" : ""}>
                • Match the confirmation
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={loading || !token}
            type="submit"
            className="w-full bg-[#16A34A] text-white py-3 rounded-xl font-medium hover:bg-[#15803D] disabled:opacity-60 transition"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#F1FFF6] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}