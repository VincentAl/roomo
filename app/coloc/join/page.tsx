"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { joinColocAction } from "@/lib/actions";
import Link from "next/link";

function JoinColocForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "invalid") setError("Invalid invite link.");
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter the invite code.");
      return;
    }
    setLoading(true);
    const result = await joinColocAction(trimmed);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.colocId) {
      router.push(`/coloc/${result.colocId}`);
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="max-w-[900px] mx-auto px-5 py-8 sm:px-10 sm:py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a202c] mb-2">
            Join a coloc
          </h1>
          <p className="text-[#718096]">
            Enter the invite code shared by a roommate.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Code (ex: ABC12345)"
            maxLength={8}
            className="w-full border border-[#e2e8f0] rounded-lg py-3 px-4 text-base mb-4 focus:outline-none focus:border-[#2d3748]"
          />
          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2d3748] text-white rounded-xl py-4 px-6 font-semibold cursor-pointer transition-colors hover:bg-[#1a202c] disabled:opacity-50"
          >
            {loading ? "..." : "Join"}
          </button>
        </form>

        <Link
          href="/dashboard"
          className="inline-block mt-6 text-[#718096] hover:text-[#2d3748] text-sm"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}

export default function JoinColocPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen pb-24 flex items-center justify-center p-6">
        <p className="text-[#718096]">Loading...</p>
      </main>
    }>
      <JoinColocForm />
    </Suspense>
  );
}
