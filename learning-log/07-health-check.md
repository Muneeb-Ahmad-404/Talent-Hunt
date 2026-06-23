### (1) Why is the health check wired directly in app.ts rather than inside a module under src/modules/?
Because its not a seperate functionality or business logic, its part of the infrastructure.

---

### (2) Imagine you had added a SELECT 1 to the health check handler. The database goes down. Walk through exactly what happens to the running process — step by step — and explain why that's a worse outcome than if the health check hadn't queried the database at all.
The database goes down or struggles under load, causing the health check to fail and return error code 500. The orchestrator (like Docker or Kubernetes) sees this non-200 status, assumes the application process itself is broken, and restarts the application container. Upon restarting, a brand new database connection pool is opened. 

This creates a cascading failure (a "death spiral") where the already struggling database is met with a massive surge of new connection requests, crushing the database completely and causing all application instances to fail their health checks and restart in a continuous loop. This is far worse than if the database was not queried at all, because it turns a temporary database slowdown into a total application infrastructure collapse.

---

### (3) What is the difference between a liveness probe and a readiness probe? Which one did you just build, and which chapter builds the other?
A liveness probe checks if the process is live and executing (making sure the event loop isn't frozen or deadlocked). If it fails, the orchestrator restarts the container. 

A readiness probe checks if the process is ready to receive network traffic and if its vital dependencies (like the database or cache) are working well too. If it fails, traffic is temporarily routed away from the container, but the container is not killed. 

This chapter builds a liveness probe, while the subsequent chapter (such as Chapter 12) builds the readiness probe.