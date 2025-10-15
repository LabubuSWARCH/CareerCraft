import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATH = ["/"];
const AUTH_PATH = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const PROTECTED_PATH = ["/resumes"];

export function middleware(request: NextRequest) {
  const isAuthPath = AUTH_PATH.some((path) =>
    new RegExp(`^${path}$`).test(request.nextUrl.pathname)
  );
  const isPublicPath = PUBLIC_PATH.some((path) =>
    new RegExp(`^${path}$`).test(request.nextUrl.pathname)
  );
  const isProtectedPath = PROTECTED_PATH.some((path) =>
    new RegExp(`^${path}$`).test(request.nextUrl.pathname)
  );

  const token = request.cookies.get("SESSION_TOKEN")?.value;

  if (isProtectedPath) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isAuthPath) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (isPublicPath) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
