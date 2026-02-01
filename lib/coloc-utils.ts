import type { Item, UserProfile } from "./types";

function simpleHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

export function getProchainAcheteur(
  item: Item,
  members: UserProfile[]
): UserProfile | null {
  if (members.length === 0) return null;

  const compteurs: Record<string, number> = {};
  for (const m of members) {
    compteurs[m.id] = item.achats.filter((a) => a.userId === m.id).length;
  }

  const minAchats = Math.min(...Object.values(compteurs));
  const candidats = Object.keys(compteurs)
    .filter((id) => compteurs[id] === minAchats)
    .sort();

  if (candidats.length === 1) {
    return members.find((m) => m.id === candidats[0]) ?? null;
  }

  const hash = simpleHash(item.id + item.name);
  const index = hash % candidats.length;
  const idCandidat = candidats[index];
  return members.find((m) => m.id === idCandidat) ?? null;
}
