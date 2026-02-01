import { auth } from "@/lib/auth";

export default auth((req) => {
  const isAuth = !!req.auth;
  const { pathname } = req.nextUrl;

  const publicPaths = ["/", "/auth/signin", "/coloc/join"];
  const isPublic =
    publicPaths.some((p) => pathname === p) ||
    pathname.startsWith("/coloc/join/") ||
    pathname.startsWith("/api/auth");

  if (!isAuth && !isPublic) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(signInUrl);
  }

  if (isAuth && (pathname === "/" || pathname === "/auth/signin")) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  return undefined;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
