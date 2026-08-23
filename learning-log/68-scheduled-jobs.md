BullMQ stores repeatable job configuration in Redis. Write down the Redis key prefix that BullMQ uses for repeatable jobs (check with redis-cli KEYS "bull:*repeat*"). Explain what would happen to the scheduled jobs if you flushed Redis (FLUSHDB) — what would you need to do to restore the schedule?

The prefix used for repeatable jobs is queue.upserJobScheduler(pattern:"cron pattern")
I would just need to re-run the worker and the jobs would be scheudled again.

---

Both cleanup handlers log the number of deleted rows. Run each handler twice in quick succession. Write down the rowCount for each run. Explain what this demonstrates about the idempotency of DELETE queries.

The first run cleaned 62 refresh token rows and 1 otp row. The second run cleaned 0, as there was nothing left to delete because of the previous run. This shows us that delete operation is idempotent in itself cuz no matter how many times you run it you are gonna end up with the same result.