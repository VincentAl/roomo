import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserColocs, getColoc, getUser, setUser } from "@/lib/kv";
import { Plus, LogIn } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const existingUser = await getUser(session.user.id);
  if (!existingUser) {
    await setUser(session.user.id, {
      id: session.user.id,
      email: session.user.email ?? null,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    });
  }

  const colocIds = await getUserColocs(session.user.id);
  const colocs = await Promise.all(
    colocIds.map(async (id) => ({ id, coloc: await getColoc(id) }))
  );
  const validColocs = colocs.filter((c) => c.coloc) as {
    id: string;
    coloc: Awaited<ReturnType<typeof getColoc>>;
  }[];

  return (
    <main className="min-h-screen pb-24">
      <div className="max-w-[900px] mx-auto px-5 py-8 sm:px-10 sm:py-10">
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a202c] mb-2">
            My Colocs
          </h1>
          <p className="text-[#718096]">Pick a coloc or create one.</p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {validColocs.length === 0 ? (
            <p className="text-center text-[#718096] py-12">
              You&apos;re not in any coloc yet.
            </p>
          ) : (
            validColocs.map(({ id, coloc }) => (
              <Link
                key={id}
                href={`/coloc/${id}`}
                className="block bg-white border-2 border-[#e2e8f0] rounded-xl p-5 shadow-sm transition-all hover:shadow-md hover:border-[#cbd5e0]"
              >
                <h2 className="text-lg font-semibold text-[#1a202c]">
                  {coloc!.name}
                </h2>
              </Link>
            ))
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/coloc/new"
            className="inline-flex items-center justify-center gap-2 bg-[#2d3748] text-white rounded-xl py-4 px-6 font-semibold transition-colors hover:bg-[#1a202c]"
          >
            <Plus size={20} />
            Create coloc
          </Link>
          <Link
              href="/coloc/join"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#2d3748] border-2 border-[#e2e8f0] rounded-xl py-4 px-6 font-semibold transition-colors hover:border-[#2d3748]"
            >
              <LogIn size={20} />
              Join with code
            </Link>
        </div>

        <div className="mt-12 pt-6 border-t border-[#e2e8f0]">
          <form
            action={async () => {
              "use server";
              const { signOut } = await import("@/lib/auth");
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-[#718096] text-sm font-medium hover:text-red-600 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
