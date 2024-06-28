import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";



const isRootRoute = createRouteMatcher(["/"]);


export default clerkMiddleware((auth, req) => {
  if (isRootRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    // Match all routes except static files and _next
    '/((?!.*\\..*|_next).*)', 
    // Specifically match the root route
    '/',
    // Match API routes
    '/api/(.*)',
  ],
};
//latest clerk doesnt automatically make routes in accessible