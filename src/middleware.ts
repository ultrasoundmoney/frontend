import { type NextRequest, NextResponse } from "next/server";
import * as RelayConfig from "./relay/config";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname === "/relay") {
    const newUrl = RelayConfig.getDomain();
    return NextResponse.redirect(newUrl);
  }

  const host = req.headers.get("host") || "";
  if (host.startsWith("relay")) {
    url.pathname = `/relay${url.pathname}`;
    return NextResponse.rewrite(url);
  }
}
