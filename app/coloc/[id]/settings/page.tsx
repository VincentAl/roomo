import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getColoc, getColocMembers, getColocItems, getUser, isColocMember } from "@/lib/kv";
import { SettingsClient } from "./settings-client";
import { SignOutButton } from "@/components/sign-out-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SettingsPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const member = await isColocMember(id, session.user.id);
  if (!member) redirect("/dashboard");

  const [coloc, memberIds, items] = await Promise.all([
    getColoc(id),
    getColocMembers(id),
    getColocItems(id),
  ]);

  const members = await Promise.all(
    memberIds.map((uid) => getUser(uid))
  );
  const validMembers = members.filter(
    (m): m is NonNullable<typeof m> => m != null
  );

  if (!coloc) redirect("/dashboard");

  return (
    <div className="w-full max-w-[900px] mx-auto px-5 py-8 sm:px-10 sm:py-10">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a202c]">
            Settings
          </h1>
          <SignOutButton />
        </div>
        <p className="text-[#718096]">Manage members and items</p>
      </div>

      <SettingsClient
        colocId={id}
        colocName={coloc.name}
        inviteCode={coloc.inviteCode}
        members={validMembers}
        items={items}
        currentUserId={session.user.id}
      />
    </div>
  );
}
