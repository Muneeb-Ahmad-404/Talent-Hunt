```markdown
## Schema Design: Jobs Table

```sql
CREATE TABLE jobs (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          uuid        NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  title               text        NOT NULL,
  description         text        NOT NULL,
  status              text        NOT NULL DEFAULT 'draft'
                                    CHECK (status IN ('draft', 'open', 'closed')),
  deadline            date,
  attributes          jsonb       NOT NULL DEFAULT '{}',
  screening_questions jsonb       NOT NULL DEFAULT '[]',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

```

---

### Attributes

These are arbitrary for different jobs i.e. the work medium (remote/hybrid/physical etc), perks offered with the job etc. Though they can be used for searching and filtering but postgres's jsonb can still be filtered fast with this wildly arbitraring data

---

### screening_questions

these are first of allentirely different for different orgs. There could be uses like searching orgs based on questions or banking these questions etc... but these are not our requirements so that's why jsonb.

---

## Questions

### status is a real column. attributes is JSONB. Apply the column-vs-JSONB rule to justify both decisions in one paragraph.

status is from the set of defined values, it can be used for querying (joins) as we only list open jobs. It is relational the applications functionality depends upon it. based on these status is suitable as a column.

---

### A product manager asks you to add a "Remote only" filter to the job board. The remote_policy field currently lives in attributes JSONB. What change does that filter require — schema-level, query-level, and migration? Walk through each step.

You only need a migration to safely build the index concurrently without locking your table:

---

### Explain why the screening_questions question id field must remain stable after an applicant submits their answers. What breaks if a recruiter edits the question text and the id changes?

the order of the answer's change or for the updated questions the provided answers are no more linked to the updated id. If a recruiter edits the questions text and id changes the answers made by applicants for that question would not be linked to the new id.

```

```