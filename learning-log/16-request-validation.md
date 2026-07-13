updateJobSchema = jobFieldsSchema.partial() makes every field optional with no defaults. If a recruiter sends { "status": "archived" } in a PATCH body, what does safeParse return — and why?

It would returns an object mentioning that the value for status is not the one from the enum-values.

---

Query parameters from a URL are always strings. Explain what happens if you use z.number().min(1) (without coerce) on the page query parameter when a request comes in with ?page=2.

The validation layer return an object before making the request for the page. Saying that there is a type mismatch.