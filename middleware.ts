export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/admin/:path*",
    "/api/projects/:path*",
    "/api/admin/:path*",
  ],
};
