You add a new PaymentRequiredError (HTTP 402) for a future billing feature. Write the complete class definition. What is the only file you need to change?

I would need to change the errors.ts only.

```typescript
export class PaymentRequiredError extends AppError {
    constructor(message = "Payment is required") {
        super(402, "PAYMENT_REQUIRED", message);
    }
}
```

---

A route calls await someService.doThing() and the service throws a ConflictError. You do not have a try/catch in the route handler. In Express 4, does the error reach the error handler — and why or why not? What would you need to add to guarantee it does?

The error by default would not reach the error handler in case of async function and that is because express 4 does not catch it and it becomes an unhandled rejection. So to catch it we use try catch and for it to reach the handler we need to pass it as a parameter to next as next(err).

---

Your error handler logs the full error with console.error on 500s. In a production system with structured logging (e.g. sending logs to Datadog or CloudWatch), what would you pass to the logger instead of just the raw err object to make the log entry useful?

the path and the message the path to know where the error occured and the message to know why or what occured, we can use error codes call stack and timestamps too for better debugging and to understand what trigerred the error.
```