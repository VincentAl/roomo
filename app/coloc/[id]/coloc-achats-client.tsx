"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ItemCard } from "@/components/item-card";
import { getProchainAcheteur } from "@/lib/coloc-utils";
import { marquerAchatAction } from "@/lib/actions";
import type { Item, UserProfile } from "@/lib/types";

interface ItemWithBuyer {
  item: Item;
  prochainAcheteur: UserProfile | null;
}

interface ColocAchatsClientProps {
  colocId: string;
  items: Item[];
  members: UserProfile[];
  currentUserId: string;
}

export function ColocAchatsClient({
  colocId,
  items,
  members,
  currentUserId,
}: ColocAchatsClientProps) {
  const router = useRouter();

  const { myTurn, others } = useMemo(() => {
    const mine: ItemWithBuyer[] = [];
    const rest: ItemWithBuyer[] = [];
    for (const item of items) {
      const prochainAcheteur = getProchainAcheteur(item, members);
      const entry = { item, prochainAcheteur };
      if (prochainAcheteur?.id === currentUserId) {
        mine.push(entry);
      } else {
        rest.push(entry);
      }
    }
    return { myTurn: mine, others: rest };
  }, [items, members, currentUserId]);

  async function handleMarquerAchat(itemId: string, userId: string) {
    await marquerAchatAction(colocId, itemId, userId);
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
          My turn
        </h2>
        {myTurn.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTurn.map(({ item, prochainAcheteur }) => (
              <ItemCard
                key={item.id}
                item={item}
                prochainAcheteur={prochainAcheteur}
                onMarquerAchat={handleMarquerAchat}
                isMyTurn
              />
            ))}
          </div>
        ) : (
          <p className="text-[#718096] italic">Nothing to buy this time!</p>
        )}
      </section>
      {others.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-[#718096] mb-4">
            Others
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map(({ item, prochainAcheteur }) => (
              <ItemCard
                key={item.id}
                item={item}
                prochainAcheteur={prochainAcheteur}
                onMarquerAchat={handleMarquerAchat}
                showButton={false}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
