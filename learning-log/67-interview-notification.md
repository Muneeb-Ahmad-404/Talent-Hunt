You have now moved two email calls to background jobs (Chapters 64 and 67). List every inline await mailer.* call that still exists in any service file. For each one, decide whether it should also be moved to a job (and why or why not).

None exist.

---

The payload for send-interview-notification includes scheduledAt as an ISO string. Draw the full lifecycle of this value: from new Date() in the service, through JSON.stringify in BullMQ, stored in Redis, retrieved by the worker, and passed to sendInterviewNotification. Mark the point where the type changes from Date to string.

Service: new Date() → .toISOString()  ← Type changes here (Date → String)
    ↓
BullMQ/Redis: stored as JSON string
    ↓
Worker: retrieved as string
    ↓
Mailer: new Date() → formatted for email (String → Date)