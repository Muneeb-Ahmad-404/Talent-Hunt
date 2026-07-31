The router.use pattern protects every current and future route on the router automatically. But what if a specific route within a recruiter router also needed to accept admin tokens — for example, an internal audit endpoint living at GET /api/companies/audit? How would you handle that without breaking the blanket requireRole('recruiter') guard on the rest of the router?

Maybe have a similar router for admin in admin routes. or add a custom check to such routes that require admin too.

A junior developer on your team creates a new file src/modules/companies/companies-internal.routes.ts, adds a route for an internal tool, and imports it directly into app.ts without authMiddleware. The route is now publicly accessible. What process or code convention could prevent this class of mistake in the future?

Proper code reviews etc  and manual linting rules that prevent any such route without definitive middleware for protected routes. Integration tests, seperate public, protected folders could be used to seperate routes.