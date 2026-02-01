"use client";

import { AlertCircle } from "lucide-react";
import type { UserProfile } from "@/lib/types";
import type { Item } from "@/lib/types";

interface ItemCardProps {
  item: Item;
  prochainAcheteur: UserProfile | null;
  onMarquerAchat: (itemId: string, userId: string) => void;
  showButton?: boolean;
  isMyTurn?: boolean;
}

export function ItemCard({
  item,
  prochainAcheteur,
  onMarquerAchat,
  showButton = true,
  isMyTurn = false,
}: ItemCardProps) {
  return (
    <div
      className={`h-full flex flex-col justify-between bg-white border-2 rounded-xl p-6 transition-all ${
        item.estEpuise
          ? "border-[#e53e3e] shadow-md shadow-red-100"
          : "border-[#cbd5e0] shadow-sm hover:shadow-md hover:border-[#2d3748]"
      }`}
    >
      <div>
        <h3 className="font-mono text-lg sm:text-xl font-semibold text-[#1a202c]">
          {item.name}
        </h3>
        {item.estEpuise && (
          <span className="inline-flex items-center gap-1 bg-[#e53e3e] text-white px-2 py-1 text-xs font-medium rounded mt-2">
            <AlertCircle size={14} />
            Out
          </span>
        )}
      </div>

      {prochainAcheteur && (
        <div className="flex flex-col gap-1 mt-4">
          {!isMyTurn && (
            <>
              <span className="text-xs text-[#718096] font-medium">
                Next buyer
              </span>
              <span className="font-medium text-[#2d3748]">
                {prochainAcheteur.name ?? prochainAcheteur.email ?? "—"}
              </span>
            </>
          )}
          {showButton && (
            <button
              type="button"
              onClick={() => onMarquerAchat(item.id, prochainAcheteur.id)}
              className={`${isMyTurn ? "" : "mt-3"} bg-[#2d3748] text-white rounded-lg py-3 px-5 text-sm font-semibold cursor-pointer transition-all hover:bg-[#1a202c]`}
            >
              I bought it
            </button>
          )}
        </div>
      )}
    </div>
  );
}
