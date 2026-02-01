import { kv } from "@vercel/kv";
import type { UserProfile, Coloc, Item } from "./types";

const USER_PREFIX = "user:";
const COLOC_PREFIX = "coloc:";
const INVITE_PREFIX = "invite:";

function userKey(id: string) {
  return `${USER_PREFIX}${id}`;
}

function colocKey(id: string) {
  return `${COLOC_PREFIX}${id}`;
}

function membersKey(colocId: string) {
  return `${COLOC_PREFIX}${colocId}:members`;
}

function itemsKey(colocId: string) {
  return `${COLOC_PREFIX}${colocId}:items`;
}

function userColocsKey(userId: string) {
  return `${USER_PREFIX}${userId}:colocs`;
}

function inviteKey(code: string) {
  return `${INVITE_PREFIX}${code}`;
}

export async function getUser(userId: string): Promise<UserProfile | null> {
  const data = await kv.get<UserProfile>(userKey(userId));
  return data;
}

export async function setUser(userId: string, user: UserProfile): Promise<void> {
  await kv.set(userKey(userId), user);
}

export async function getColoc(colocId: string): Promise<Coloc | null> {
  const data = await kv.get<Coloc>(colocKey(colocId));
  return data;
}

export async function setColoc(coloc: Coloc): Promise<void> {
  await kv.set(colocKey(coloc.id), coloc);
}

export async function getColocMembers(colocId: string): Promise<string[]> {
  const members = await kv.smembers(membersKey(colocId));
  return Array.isArray(members) ? members : [];
}

export async function addColocMember(colocId: string, userId: string): Promise<void> {
  await kv.sadd(membersKey(colocId), userId);
}

export async function removeColocMember(colocId: string, userId: string): Promise<void> {
  await kv.srem(membersKey(colocId), userId);
}

export async function removeUserColoc(userId: string, colocId: string): Promise<void> {
  await kv.srem(userColocsKey(userId), colocId);
}

export async function getColocItems(colocId: string): Promise<Item[]> {
  const data = await kv.get<Record<string, Item>>(itemsKey(colocId));
  if (!data || typeof data !== "object") return [];
  return Object.values(data);
}

export async function setColocItems(colocId: string, items: Item[]): Promise<void> {
  const record: Record<string, Item> = {};
  for (const item of items) {
    record[item.id] = item;
  }
  await kv.set(itemsKey(colocId), record);
}

export async function updateColocItem(
  colocId: string,
  itemId: string,
  update: Partial<Item>
): Promise<void> {
  const data = await kv.get<Record<string, Item>>(itemsKey(colocId)) ?? {};
  const item = data[itemId];
  if (!item) return;
  data[itemId] = { ...item, ...update };
  await kv.set(itemsKey(colocId), data);
}

export async function addColocItem(colocId: string, item: Item): Promise<void> {
  const data = await kv.get<Record<string, Item>>(itemsKey(colocId)) ?? {};
  data[item.id] = item;
  await kv.set(itemsKey(colocId), data);
}

export async function removeColocItem(colocId: string, itemId: string): Promise<void> {
  const data = await kv.get<Record<string, Item>>(itemsKey(colocId)) ?? {};
  delete data[itemId];
  await kv.set(itemsKey(colocId), data);
}

export async function getUserColocs(userId: string): Promise<string[]> {
  const colocs = await kv.smembers(userColocsKey(userId));
  return Array.isArray(colocs) ? colocs : [];
}

export async function addUserColoc(userId: string, colocId: string): Promise<void> {
  await kv.sadd(userColocsKey(userId), colocId);
}

export async function setInvite(inviteCode: string, colocId: string): Promise<void> {
  await kv.set(inviteKey(inviteCode), colocId);
}

export async function getColocByInviteCode(inviteCode: string): Promise<string | null> {
  const colocId = await kv.get<string>(inviteKey(inviteCode));
  return colocId;
}

export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function isColocMember(colocId: string, userId: string): Promise<boolean> {
  const members = await getColocMembers(colocId);
  return members.includes(userId);
}
