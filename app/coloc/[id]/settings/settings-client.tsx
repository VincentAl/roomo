"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Copy, Check } from "lucide-react";
import { addItemAction, deleteItemAction, removeMemberAction } from "@/lib/actions";
import type { UserProfile, Item } from "@/lib/types";

interface SettingsClientProps {
  colocId: string;
  colocName: string;
  inviteCode: string;
  members: UserProfile[];
  items: Item[];
  currentUserId: string;
}

export function SettingsClient({
  colocId,
  inviteCode,
  members,
  items,
  currentUserId,
}: SettingsClientProps) {
  const router = useRouter();
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/coloc/join/${inviteCode}`
      : `https://example.com/coloc/join/${inviteCode}`;

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!newItemName.trim()) {
      setError("Name required");
      return;
    }
    setLoading(true);
    const result = await addItemAction(colocId, newItemName.trim());
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setNewItemName("");
    router.refresh();
  }

  async function handleDeleteItem(itemId: string) {
    await deleteItemAction(colocId, itemId);
    router.refresh();
  }

  async function handleRemoveMember(userId: string) {
    setRemovingId(userId);
    const result = await removeMemberAction(colocId, userId);
    setRemovingId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.left) {
      router.push("/dashboard");
      router.refresh();
    } else {
      router.refresh();
    }
  }

  function copyInviteLink() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-6">
      <section className="bg-white border-2 border-[#e2e8f0] rounded-xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-[#1a202c] mb-4">
          Shopping items
        </h2>
        <form onSubmit={handleAddItem} className="flex gap-3 mb-6 flex-wrap">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name"
            className="flex-1 min-w-[140px] border border-[#e2e8f0] rounded-lg py-3 px-4 text-base focus:outline-none focus:border-[#2d3748]"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-[#2d3748] text-white rounded-lg py-3 px-5 font-medium cursor-pointer transition-colors hover:bg-[#1a202c] disabled:opacity-50 shrink-0"
          >
            <Plus size={20} />
            Add
          </button>
        </form>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex flex-col gap-3">
          {items.length === 0 ? (
            <p className="text-[#a0aec0] italic text-center py-5">
              No items yet
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 bg-[#f7fafc] border border-[#e2e8f0] rounded-lg transition-all hover:border-[#cbd5e0]"
              >
                <span className="font-medium text-[#2d3748]">{item.name}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-500 p-2 rounded-lg cursor-pointer transition-colors hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="bg-white border-2 border-[#e2e8f0] rounded-xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-[#1a202c] mb-4">
          Roommates
        </h2>
        <div className="flex flex-col gap-3 mb-6">
          {members.length === 0 ? (
            <p className="text-[#a0aec0] italic text-center py-5">
              No roommates yet
            </p>
          ) : (
            members.map((m) => {
              const isMe = m.id === currentUserId;
              return (
                <div
                  key={m.id}
                  className="flex justify-between items-center gap-4 p-4 bg-[#f7fafc] border border-[#e2e8f0] rounded-lg transition-all hover:border-[#cbd5e0]"
                >
                  <span className="font-medium text-[#2d3748]">
                    {m.name ?? m.email ?? m.id}
                    {isMe && (
                      <span className="ml-2 text-xs text-[#718096] font-normal">
                        (you)
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(m.id)}
                    disabled={removingId === m.id}
                    className={`shrink-0 py-2 px-3 text-xs font-medium rounded-lg cursor-pointer transition-colors disabled:opacity-50 ${
                      isMe
                        ? "text-[#718096] border border-[#cbd5e0] hover:bg-[#f7fafc]"
                        : "text-red-600 border border-red-200 hover:bg-red-50"
                    }`}
                  >
                    {isMe ? "Leave coloc" : "Remove"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-4 border-t border-[#e2e8f0]">
          <p className="text-[#718096] text-sm mb-3">
            Invite link
          </p>
          <div className="flex flex-wrap gap-2">
            <code className="flex-1 min-w-0 bg-[#f7fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 font-mono text-sm break-all">
              {inviteUrl}
            </code>
            <button
              type="button"
              onClick={copyInviteLink}
              className="inline-flex items-center gap-2 bg-[#2d3748] text-white rounded-lg py-3 px-4 font-medium cursor-pointer transition-colors hover:bg-[#1a202c] shrink-0"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
