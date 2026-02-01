"use server";

import { auth } from "@/lib/auth";
import {
  getColocItems,
  setColocItems,
  addColocItem,
  removeColocItem,
  updateColocItem,
  setColoc,
  setInvite,
  generateInviteCode,
  addColocMember,
  addUserColoc,
  removeColocMember,
  removeUserColoc,
  getColocByInviteCode,
  isColocMember,
  setUser,
} from "@/lib/kv";
import type { Coloc, Item } from "@/lib/types";

export async function ensureUserInKv(userId: string, name: string | null, email: string | null, image: string | null) {
  const { getUser } = await import("@/lib/kv");
  const existing = await getUser(userId);
  if (!existing) {
    await setUser(userId, { id: userId, email, name, image });
  }
}

export async function createColocAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in" };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name required" };

  const { getUser } = await import("@/lib/kv");
  const existingUser = await getUser(session.user.id);
  if (!existingUser) {
    await setUser(session.user.id, {
      id: session.user.id,
      email: session.user.email ?? null,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    });
  }

  const id = crypto.randomUUID();
  const inviteCode = generateInviteCode();

  const coloc: Coloc = {
    id,
    name,
    inviteCode,
    createdAt: Date.now(),
    createdBy: session.user.id,
  };

  await setColoc(coloc);
  await addColocMember(id, session.user.id);
  await addUserColoc(session.user.id, id);
  await setInvite(inviteCode, id);

  return { colocId: id };
}

export async function joinColocAction(inviteCode: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in" };

  const colocId = await getColocByInviteCode(inviteCode);
  if (!colocId) return { error: "Invalid link" };

  const already = await isColocMember(colocId, session.user.id);
  if (already) return { colocId };

  const { setUser, getUser } = await import("@/lib/kv");
  const u = await getUser(session.user.id);
  if (!u) {
    await setUser(session.user.id, {
      id: session.user.id,
      email: session.user.email ?? null,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    });
  }

  await addColocMember(colocId, session.user.id);
  await addUserColoc(session.user.id, colocId);

  return { colocId };
}

export async function marquerAchatAction(colocId: string, itemId: string, userId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in" };

  const isMember = await isColocMember(colocId, session.user.id);
  if (!isMember) return { error: "Access denied" };

  const items = await getColocItems(colocId);
  const item = items.find((i) => i.id === itemId);
  if (!item) return { error: "Item not found" };

  const updated: Item = {
    ...item,
    achats: [...item.achats, { userId, date: Date.now() }],
    estEpuise: false,
  };

  const updatedList = items.map((i) => (i.id === itemId ? updated : i));
  await setColocItems(colocId, updatedList);

  return {};
}

export async function toggleEpuiseAction(colocId: string, itemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in" };

  const isMember = await isColocMember(colocId, session.user.id);
  if (!isMember) return { error: "Access denied" };

  const items = await getColocItems(colocId);
  const item = items.find((i) => i.id === itemId);
  if (!item) return { error: "Item not found" };

  await updateColocItem(colocId, itemId, { estEpuise: !item.estEpuise });
  return {};
}

export async function addItemAction(colocId: string, name: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in" };

  const isMember = await isColocMember(colocId, session.user.id);
  if (!isMember) return { error: "Access denied" };

  const trimmed = name.trim();
  if (!trimmed) return { error: "Name required" };

  const item: Item = {
    id: crypto.randomUUID(),
    name: trimmed,
    achats: [],
    estEpuise: false,
  };

  await addColocItem(colocId, item);
  return {};
}

export async function deleteItemAction(colocId: string, itemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in" };

  const isMember = await isColocMember(colocId, session.user.id);
  if (!isMember) return { error: "Access denied" };

  await removeColocItem(colocId, itemId);
  return {};
}

export async function removeMemberAction(colocId: string, userIdToRemove: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in" };

  const isMember = await isColocMember(colocId, session.user.id);
  if (!isMember) return { error: "Access denied" };

  const targetIsMember = await isColocMember(colocId, userIdToRemove);
  if (!targetIsMember) return { error: "User not a member" };

  await removeColocMember(colocId, userIdToRemove);
  await removeUserColoc(userIdToRemove, colocId);

  return { left: session.user.id === userIdToRemove };
}
