"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-2 text-[#718096] hover:text-red-600 transition-colors text-sm font-medium"
    >
      <LogOut size={18} />
      Sign out
    </button>
  );
}
