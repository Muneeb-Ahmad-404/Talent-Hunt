Open src/shared/queue.ts and src/worker/worker.ts side by side. Draw an arrow for every Redis connection that each file creates. Explain in one sentence why BullMQ refuses to share the same connection between the Queue and the Worker.

queue.ts has one redis connection and that is when the queue is created, similarly worker has one connection and that is on workers creation.

BullMQ uses blocking Redis commands (BLPOP, BRPOPLPUSH) and Lua scripts that require dedicated, non-shared connections to avoid blocking other operations. For that purpose the connection is not shared between the queue and the worker

---

The worker's switch statement has a default case that logs a warning. What would happen instead if you threw an error in the default case? Walk through the BullMQ retry cycle for a job with an unknown name: what would happen on each retry attempt?

That would results in infinite tries, a better option is to log this as a warning and skip the job that way we save our resources as well