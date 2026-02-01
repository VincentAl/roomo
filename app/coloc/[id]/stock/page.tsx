import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getColocItems, isColocMember } from "@/lib/kv";
import { AlertCircle } from "lucide-react";
import { StockListClient } from "./stock-list-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StockPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const member = await isColocMember(id, session.user.id);
  if (!member) redirect("/dashboard");

  const items = await getColocItems(id);

  return (
    <div className="w-full max-w-[900px] mx-auto px-5 py-8 sm:px-10 sm:py-10">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a202c] mb-2">
          Stock
        </h1>
        <p className="text-[#718096]">Toggle when an item runs out</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-[#718096]">
          <AlertCircle size={48} strokeWidth={1.5} className="mx-auto mb-5 opacity-50" />
          <p>No items to manage</p>
        </div>
      ) : (
        <StockListClient colocId={id} items={items} />
      )}
    </div>
  );
}
