import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { joinColocAction } from "@/lib/actions";
import { getColocByInviteCode } from "@/lib/kv";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function JoinColocByCodePage({ params }: PageProps) {
  const { code } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    const signInUrl = `/auth/signin?callbackUrl=${encodeURIComponent(`/coloc/join/${code}`)}`;
    redirect(signInUrl);
  }

  const colocId = await getColocByInviteCode(code.toUpperCase());
  if (!colocId) {
    redirect("/coloc/join?error=invalid");
  }

  const result = await joinColocAction(code.toUpperCase());
  if (result.error) {
    redirect(`/coloc/join?error=${encodeURIComponent(result.error)}`);
  }
  redirect(`/coloc/${result.colocId}`);
}
