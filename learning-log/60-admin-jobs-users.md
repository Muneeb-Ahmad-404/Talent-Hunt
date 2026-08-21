Explain to a peer why deleting refresh tokens on suspension does not immediately lock out the user. Draw the timeline: suspension event → access token expiry → user is fully locked out. How long is the gap?

Deleting refresh tokens does not immediately lock out the user has the user still have an access token, with that access token he have a ttl for the duration of it he is an authenticated user and can make requests etc. The suspension event occurs, the refresh tokens deleted, access token could have a ttl left btw 0-15 mins, after this gap the user is fully locked out. 

---

The listJobs query does not filter by company ownership. Write down two scenarios where this is intentional and correct, and one scenario where it could be a problem if this endpoint were accidentally exposed to non-admin users.

Because this is an admin route and list all companies irrespective of the owner ship. The admin is a sovereign entity and is authorized to view information that other routes are not. The admin may need to observe companies to verify them ,suspend them etc.. Or the same goees for the users and jobs. THis could be a problem if a non admin user gets access to these routes as he would be exposed to information that he is not authenticated for. If the route were accidentally exposed to a recruiter — they would see jobs from all companies, not just their own. This violates multi-tenant isolation and leaks sensitive business information (e.g., competitors' job postings, hiring activity, salary data).