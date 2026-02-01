export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
}

export interface Coloc {
  id: string;
  name: string;
  inviteCode: string;
  createdAt: number;
  createdBy: string;
}

export interface Achat {
  userId: string;
  date: number;
}

export interface Item {
  id: string;
  name: string;
  estEpuise: boolean;
  achats: Achat[];
}

export interface ColocWithMembers extends Coloc {
  members: UserProfile[];
}

export interface ItemWithAcheteur extends Item {
  prochainAcheteur: UserProfile | null;
}
