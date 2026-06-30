```markdown
The TRUNCATE statement uses CASCADE. Rewrite it as a series of individual DELETE FROM statements (no CASCADE). In what order must those statements run, and why?

---

## Correct DELETE Order

```sql
-- 1. First delete all applications
DELETE FROM applications 
WHERE job_id IN (
  SELECT id FROM jobs 
  WHERE recruiter_id IN (
    SELECT id FROM recruiters 
    WHERE company_id = 'company_id_here'
  )
);

-- 2. Then delete all jobs
DELETE FROM jobs 
WHERE recruiter_id IN (
  SELECT id FROM recruiters 
  WHERE company_id = 'company_id_here'
);

-- 3. Then delete all recruiters
DELETE FROM recruiters 
WHERE company_id = 'company_id_here';

-- 4. Finally delete the company
DELETE FROM companies 
WHERE id = 'company_id_here';
```

Why does the script hash passwords at all? The seed users are fake — would storing the literal string 'password123' in password_hash break anything?

Literal string would break the authentication part where we need to compare the hash through bcrypt. Also the database stores hash values and not literal strings. To go with the plain text we would need to change both which is not really a good option.
