"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Settings } from "lucide-react";

interface NavBarProps {
  colocId: string;
}

export function NavBar({ colocId }: NavBarProps) {
  const pathname = usePathname();
  const base = `/coloc/${colocId}`;

  const links = [
    { href: base, label: "Shopping", icon: Home },
    { href: `${base}/stock`, label: "Stock", icon: ShoppingCart },
    { href: `${base}/settings`, label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] flex justify-center z-[100] safe-area-pb shadow-lg">
      <div className="flex w-full max-w-lg">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === base ? pathname === base : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-3 transition-colors ${
                isActive ? "text-[#2d3748]" : "text-[#a0aec0] hover:text-[#718096]"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs ${isActive ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
