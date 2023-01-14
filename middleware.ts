// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Users services
import UsersServices from "./services/users.services";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (
    !request.nextUrl.pathname.includes("/signin") &&
    !request.nextUrl.pathname.includes("/signup") &&
    UsersServices.isAuthentificated()
  ) {
    return NextResponse.redirect(new URL("/users/signup", request.url));
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
