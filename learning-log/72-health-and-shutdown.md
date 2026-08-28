Explain the difference between liveness and readiness to a colleague who has not read this chapter. Use the analogy of a restaurant: what is the equivalent of "the restaurant is open" (liveness) vs "the kitchen is ready to accept orders" (readiness)?

Liveness is that something is alive or lets say exists and readiness is when that thing is ready to perform its tasks. For example a resturaunt could have just opened meaning the resturaunt is live but they might not have prepared the kitchen etc yet and might not be ready to server for some time. So the resturaunt is live but not ready. Thats similar to the server liveness and readiness.

---

The graceful shutdown waits up to 5 seconds for in-flight requests. Open a connection with curl --max-time 10 http://localhost:3000/slow-route (or a route with an artificial delay). Send SIGTERM while the request is in flight. Observe whether the request completes or is cut off. Write down what you see and why.

The request completed even though it took longer than the 5-second timeout because server.close() waits for all in-flight requests to finish before shutting down, and the 5-second force-exit timeout only fires if the event loop is completely blocked. Since my slow-route uses setTimeout (which yields the event loop), the process remained responsive, allowing the request to finish and the cleanup to proceed normally without hitting the forced exit. The timeout serves as a safety net for cases where the event loop is blocked and cannot complete cleanup within the allotted time.