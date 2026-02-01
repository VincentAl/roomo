import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const devUsers = [
  { id: "dev-alice", email: "alice@dev.local", name: "Alice Dev" },
  { id: "dev-bob", email: "bob@dev.local", name: "Bob Test" },
  { id: "dev-charlie", email: "charlie@dev.local", name: "Charlie Test" },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    ...(process.env.ALLOW_DEV_CREDENTIALS === "true"
      ? [
          Credentials({
            name: "Dev",
            credentials: {
              email: { label: "User", type: "text" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              if (!credentials?.password || credentials.password !== "dev")
                return null;
              const user = devUsers.find(
                (u) => u.email === credentials.email || u.id === credentials.email
              );
              return user ? { id: user.id, email: user.email, name: user.name } : null;
            },
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const oderId = token.providerAccountId ?? token.sub ?? "";
        (session.user as { id?: string }).id = oderId as string;
      }
      return session;
    },
  },
});
