import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getColocItems, getColocMembers, getUser } from "@/lib/kv";
import { getProchainAcheteur } from "@/lib/coloc-utils";
import { ItemCard } from "@/components/item-card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ColocAchatsClient } from "./coloc-achats-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ColocAchatsPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const [items, memberIds] = await Promise.all([
    getColocItems(id),
    getColocMembers(id),
  ]);

  const members = await Promise.all(
    memberIds.map((uid) => getUser(uid))
  );
  const validMembers = members.filter(
    (m): m is NonNullable<typeof m> => m != null
  );

  return (
    <div className="w-full max-w-[900px] mx-auto px-5 py-8 sm:px-10 sm:py-10">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a202c] mb-2">
          Shopping
        </h1>
        <p className="text-[#718096]">Who buys what?</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-[#718096]">
          <ShoppingCart size={48} strokeWidth={1.5} className="mx-auto mb-5 opacity-50" />
          <p className="mb-6 text-lg">No items configured</p>
          <Link
            href={`/coloc/${id}/settings`}
            className="inline-block bg-[#2d3748] text-white rounded-xl py-4 px-6 font-semibold transition-colors hover:bg-[#1a202c]"
          >
            Add items
          </Link>
        </div>
      ) : (
        <ColocAchatsClient
          colocId={id}
          items={items}
          members={validMembers}
          currentUserId={session.user.id}
        />
      )}
    </div>
  );
}
