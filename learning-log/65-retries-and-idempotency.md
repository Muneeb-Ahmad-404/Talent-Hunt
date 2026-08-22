With the deliberate failure active, submit an application and time both attempts: attempt 1 fails at T=0, attempt 2 runs at T=1s, attempt 2 succeeds. Write down the actual timestamps from the worker log. How closely does the observed delay match the configured delay: 1000? What factors could cause it to be slightly longer?

The observed delay is slightly longer than the configured 1000ms (1s) because BullMQ adds overhead for job processing, Redis round-trip time, and the actual handler execution before the job is marked as failed and retried. Additionally, the exponential backoff with delay: 1000 means the delay doubles (1s → 2s → 4s), so the time between attempt 1 and attempt 2 is ~1s, but attempt 2 to attempt 3 is ~2s due to the exponential increase.

---

Write down the answer to: "What makes INSERT ... ON CONFLICT DO NOTHING idempotent but INSERT INTO table (col) VALUES (val) not idempotent?" Use a specific table and column from this system in your answer.

INSERT INTO applications (job_id, applicant_id) VALUES ($1, $2) is not idempotent because running it twice inserts two identical rows, creating duplicate applications.

INSERT INTO applications (job_id, applicant_id) VALUES ($1, $2) ON CONFLICT (job_id, applicant_id) DO NOTHING is idempotent because the second insert does nothing and returns the existing row, so running it twice produces the same result—one application, not two. In this system, the UNIQUE constraint on (job_id, applicant_id) ensures that each applicant can only apply once to a given job, making the ON CONFLICT pattern the correct idempotent solution.

