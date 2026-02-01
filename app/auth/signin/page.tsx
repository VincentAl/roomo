"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

const DEV_USERS = [
  { id: "dev-alice", name: "Alice Dev" },
  { id: "dev-bob", name: "Bob Test" },
  { id: "dev-charlie", name: "Charlie Test" },
];

export default function SignInPage() {
  const [devUser, setDevUser] = useState("dev-alice");
  const [devPassword, setDevPassword] = useState("");
  const [devError, setDevError] = useState("");
  const [showDevCredentials, setShowDevCredentials] = useState(false);

  useEffect(() => {
    setShowDevCredentials(process.env.NEXT_PUBLIC_DEV_CREDENTIALS === "true");
  }, []);

  async function handleDevSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDevError("");
    const result = await signIn("credentials", {
      email: devUser,
      password: devPassword,
      redirect: false,
    });
    if (result?.error) {
      setDevError("Invalid credentials (password: dev)");
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a202c] mb-2">
          Sign in
        </h1>
        <p className="text-[#718096] mb-8">
          Sign in with Google to access your colocs.
        </p>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full max-w-xs mx-auto inline-flex items-center justify-center gap-3 bg-white border-2 border-[#e2e8f0] text-[#2d3748] font-semibold px-6 py-4 rounded-xl hover:border-[#2d3748] transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {showDevCredentials && (
          <div className="mt-10 pt-8 border-t border-[#e2e8f0]">
            <p className="text-xs font-medium text-[#a0aec0] mb-4">
              Dev mode (fake users)
            </p>
            <form onSubmit={handleDevSubmit} className="flex flex-col gap-3 text-left">
              <select
                value={devUser}
                onChange={(e) => setDevUser(e.target.value)}
                className="w-full border border-[#e2e8f0] rounded-lg py-2 px-3 text-sm"
              >
                {DEV_USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <input
                type="password"
                placeholder="Password (dev)"
                value={devPassword}
                onChange={(e) => setDevPassword(e.target.value)}
                className="w-full border border-[#e2e8f0] rounded-lg py-2 px-3 text-sm"
              />
              {devError && (
                <p className="text-red-600 text-sm">{devError}</p>
              )}
              <button
                type="submit"
                className="bg-[#718096] text-white rounded-lg py-2 px-4 text-sm font-medium"
              >
                Dev login
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
