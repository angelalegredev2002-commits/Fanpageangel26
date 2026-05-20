import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  // If the user is trying to access the admin panel
  if (context.url.pathname.startsWith("/adminpanel")) {
    const session = context.cookies.get("admin_session");
    
    // If there is no valid session, redirect to login
    if (session?.value !== "authenticated") {
      return context.redirect("/login");
    }
  }

  // Continue to the requested page
  return next();
});
