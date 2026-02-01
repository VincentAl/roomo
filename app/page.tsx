import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 pb-24">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a202c] mb-3">
          Roomo
        </h1>
        <p className="text-[#718096] mb-8">Who buys what?</p>
        <Link
          href="/auth/signin"
          className="inline-block bg-[#2d3748] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#1a202c] transition-colors"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
