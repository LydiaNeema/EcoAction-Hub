"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthed } from "@/utils/auth";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed()) {
      router.replace("/auth/signin");
    }
  }, [router]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600 mt-2">Your activity and impact overview will appear here.</p>
    </main>
  );
}
