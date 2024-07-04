import { NextRequest, NextResponse } from "next/server";
import parseJwt from "./lib/parse-jwt";

export async function middleware(request: NextRequest) {
  let token = request?.cookies.get("token")?.value;
  // console.log(request?.cookies.get("token"));

  if (!token) {
    // console.log("no token - redirecting");
    const response = NextResponse.redirect(new URL("/login", request.url));
    return response;
  }

  let parts = parseJwt(token);
  if (Date.now() > parts.exp * 1000) {
    console.log("token expired - redirecting");
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      maxAge: 0,
      sameSite: "strict",
    });
    response.cookies.set({
      name: "username",
      value: "",
      httpOnly: true,
      maxAge: 0,
      sameSite: "strict",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|login|signup|activate|password-reset).*)",
  ],
};
