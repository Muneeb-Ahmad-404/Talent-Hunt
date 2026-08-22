Time the apply endpoint with the worker running, then with it stopped. Record both times. Explain why the response time is the same in both cases — what changed in the code that made the response independent of the email delivery speed?

The response time remains the same whether the worker is running or stopped because the API only enqueues the job to Redis using `queue.add()`, which resolves as soon as the job is stored in Redis—without waiting for the worker to process it. The email delivery, which previously blocked the HTTP response, is now handled asynchronously by the worker, decoupling the request from the email-sending latency.

---

Open the worker terminal and watch it process a job. Write down every log line that appears, in order, and explain what BullMQ is doing at each step (atomic pickup, handler invocation, completion acknowledgment).

The worker logs show: `[worker] Worker started`, then `[worker] Processing job send-application-confirmation (id: 1)`, and finally `[worker] Job completed`. BullMQ atomically picks the job from the `waiting` queue and moves it to the `active` set, ensuring no other worker can claim it. The handler runs, and on successful completion, the job is acknowledged and moved to the `completed` state—removing it from the active set and freeing the worker for the next job.