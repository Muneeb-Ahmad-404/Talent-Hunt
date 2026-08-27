Make three simultaneous requests to the API using curl in parallel:

curl http://localhost:3000/health &
curl http://localhost:3000/api/jobs &
curl http://localhost:3000/health &
wait
In the server output, identify the three request IDs. Find each pair of "request received" and "request completed" lines and confirm they share the same requestId. Write down what you would have seen without request IDs (interleaved lines with no correlation).

The three request IDs are "5415b32a-3507-4b3e-894a-b569ac5193df", "011794d2-c5eb-49e9-aed1-bd9eaa1f1995", and "f0cba980-6b3d-4c60-a9e0-b824a0ea2460". Each pair of "request received" and "request completed" shares the same ID, allowing you to trace a single request's full lifecycle even when multiple requests are interleaved. Without request IDs, the logs would show a jumbled sequence of lines like `GET /api/jobs 401`, `GET /health`, `GET /health 200` with no way to tell which response belongs to which request—making debugging concurrent requests nearly impossible.


---

Set LOG_LEVEL=debug and restart the API. Look for any additional log output that was not present at the default level. Where would you add logger.debug(...) calls in the codebase to surface useful development-time information without polluting production logs?


With `LOG_LEVEL=debug`, you'd see additional logs for database queries, cache operations, validation results, and authentication steps that weren't visible at the default level. You should add `logger.debug()` calls around database queries to log SQL text and parameters, in the auth middleware to log token validation success/failure, in cache functions to log hits and misses, and in validation middleware to log incoming request bodies—these provide valuable development-time insights while being filtered out in production by setting the log level to `info` or higher.