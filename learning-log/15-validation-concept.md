Your job-posting service function receives a deadline field. The validation layer has already verified it is a valid ISO date string. Describe what the service should do with it and explain what the boundary contract means for every layer below the route handler.

It should transfer the data to the next layer and conversion can happen there. Boundary contract at every layer means that the input that layer receives does not need to be corrected or validated etc and is filtered from the boundary layer.

---

A colleague says: "We have NOT NULL and CHECK constraints on every important column, so we don't need a validation layer — the database will catch bad input." Explain what the database cannot catch that a validation layer can, and what the validation layer cannot catch without the database's help.

**What database cannot catch without validation layer:**

- Business logic violations (e.g., applying to a closed job)
- Custom validation rules (e.g., deadline must be 7 days in future)
- Human-readable error messages (database errors are cryptic)
- Cross-field validation (e.g., hybrid remote requires location)
- Format-specific checks (e.g., email pattern validation)

**What validation layer cannot catch without database:**

- Uniqueness violations (email already registered, duplicate application)
- Foreign key existence (company_id must exist)
- Concurrent modifications (two users submitting simultaneously)
- Data integrity constraints (application can only exist if job is open)
- Scale-based validations (max 100 applications per job)