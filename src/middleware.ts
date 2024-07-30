import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (false) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}
