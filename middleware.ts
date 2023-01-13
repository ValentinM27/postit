// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Users services
import UsersServices from "./services/users.services";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/users/signup", request.url));
}

export const config = {
  matcher: "/",
};
