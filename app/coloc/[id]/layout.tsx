import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getColoc, isColocMember } from "@/lib/kv";
import { NavBar } from "@/components/nav-bar";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ColocLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const coloc = await getColoc(id);
  if (!coloc) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-[#718096] mb-4">Coloc introuvable.</p>
        <Link href="/dashboard" className="text-[#2d3748] font-mono font-bold underline">
          Retour au dashboard
        </Link>
      </main>
    );
  }

  const member = await isColocMember(id, session.user.id);
  if (!member) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-[#718096] mb-4">Tu n&apos;as pas accès à cette coloc.</p>
        <Link href="/dashboard" className="text-[#2d3748] font-mono font-bold underline">
          Retour au dashboard
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-[88px]">
      {children}
      <NavBar colocId={id} />
    </div>
  );
}
