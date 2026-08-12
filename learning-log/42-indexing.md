The leftmost prefix rule means (status, created_at DESC, id DESC) does not help a query that filters only on created_at without a status filter. Describe a plausible query the job portal might need in the future that would require a separate index on created_at alone or a different composite order. What would that query look like, and what index would you create?

Listing all the jobs based on the time they are created_at. 
```SQL
SELECT title
FROM jobs
SORT BY created_at;
```
I would create an idx at created_at if this query is frequent.

CREATE INDEX CONCURRENTLY builds an index without holding a write lock, but it takes longer and cannot run inside a transaction. Plain CREATE INDEX is fast but locks the table for writes during the build. Describe the operational risk of running plain CREATE INDEX on a live production jobs table with 500,000 rows, and explain under what circumstances you might still choose it over CONCURRENTLY.

Creating index plainly in production would lead to system downtime if the downtime is not scheduled it can cause customer dissatisfaction. The only situation this would be preferred is when you have a scheduled maintenance window with announced downtime, or when the table is small enough that the lock time is negligible.