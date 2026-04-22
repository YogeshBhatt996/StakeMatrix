export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/profile",
    "/api/projects/:path*",
    "/api/admin/:path*",
    "/api/profile/:path*",
    "/api/profile",
  ],
};
