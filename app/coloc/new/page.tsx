"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createColocAction } from "@/lib/actions";
import Link from "next/link";

export default function NewColocPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }
    setLoading(true);
    const result = await createColocAction(new FormData(e.target as HTMLFormElement));
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
            Create a coloc
          </h1>
          <p className="text-[#718096]">Give your coloc a name.</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Downtown Apartment"
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
            {loading ? "..." : "Create"}
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
