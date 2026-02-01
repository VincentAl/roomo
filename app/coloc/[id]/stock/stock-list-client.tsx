"use client";

import { useRouter } from "next/navigation";
import { toggleEpuiseAction } from "@/lib/actions";
import type { Item } from "@/lib/types";

interface StockListClientProps {
  colocId: string;
  items: Item[];
}

export function StockListClient({ colocId, items }: StockListClientProps) {
  const router = useRouter();

  async function handleToggle(itemId: string) {
    await toggleEpuiseAction(colocId, itemId);
    router.refresh();
  }

  return (
    <section className="w-full bg-white border-2 border-[#e2e8f0] rounded-xl p-6 sm:p-8">
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 bg-[#f7fafc] border border-[#e2e8f0] rounded-lg"
          >
            <span className={`font-medium ${item.estEpuise ? "text-red-600" : "text-[#1a202c]"}`}>
              {item.name}
            </span>
            <button
              type="button"
              onClick={() => handleToggle(item.id)}
              className={`relative w-16 h-8 rounded-full transition-colors cursor-pointer flex items-center focus:outline-none ${
                item.estEpuise ? "bg-red-500 justify-start pl-2" : "bg-[#cbd5e0] justify-end pr-2"
              }`}
            >
              {item.estEpuise && (
                <span className="text-white text-xs font-semibold">Out</span>
              )}
              <span
                className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                  item.estEpuise ? "right-1.5" : "left-1.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
