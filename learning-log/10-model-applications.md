Here is your revised text formatted cleanly into Markdown.

```markdown
# 10: Model Applications

## Data Definition Language (DDL)

```sql
CREATE TABLE applications (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id            uuid        NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  applicant_id      uuid        NOT NULL REFERENCES applicants(id) ON DELETE RESTRICT,
  stage             text        NOT NULL DEFAULT 'applied'
                                  CHECK (stage IN (
                                    'applied', 'screening', 'interview',
                                    'final_interview', 'offer',
                                    'hired', 'rejected'
                                  )),
  screening_answers jsonb       NOT NULL DEFAULT '{}',
  profile_snapshot  jsonb       NOT NULL DEFAULT '{}',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, applicant_id)
);

```

---

## Architectural Rationale

### The `UNIQUE (job_id, applicant_id)` Constraint

The applicant_id and job_id are both unique the reason for that is: each application is for a single job and each application has a single applicant so that no two applicants could read each other's applications etc.. It ensures that no applicant submit more than one applications for a single job.

### The `screening_answers` JSONB Strategy

We store the screening answers as jsonb referenced inside the application table. Now the common approach to storing these answers would be against the questions but the recruiter can change the question in case of typos or any other issues. After these changes the values or the questions now stored against screening answers are stale. To prevent this the hash content of the questions is used instead in the screening answers jsonb. With which even after updates the mapping is same.

### The Pipeline `stage` Flow

Another thing to be mentioned is the stage attribute there could be different values for different companies for standard lets say there are 7 in a pipeline.
`applied` → `screening` → `interview` → `final_interview` → `offer` → `hired`

These transitions follow particular sequence or rules for example hired can only be reached if the previous state was offer. You can't directly be hired after the first stage 'applied'.

---

## Scenario Questions & Analysis

### Q1: A teammate proposes storing stage in the screening_answers JSONB object to keep the application record "self-contained." What is the specific schema-level problem?

First off the stage is a set of pre-defined stages and enforces the tranisition rules or flow. Stage is then used for filtering and sorting as well. The fields we filter and group by need to be in column format as jsonb is not suited for such fields. The schema level problem we could face from using jsonb was we would not have been able to filter or groupby easily or we would have to hard code this implementation in the backend

### Q2: An applicant submits their shortlist. The request times out before they get a response. They click submit again. Walk through exactly what happens at the database level — which constraint fires, and what does the application layer need to do to handle it gracefully?

If the application was stored then for the new application the database would throw an error because of the unique application and jon id as it would be redundant. The application layer need to handle this breakage gracefully through validation for whether the file is already uploaded or not.

### Q3: A recruiter corrects a typo in a screening question's text after 12 applications have been submitted. Do those 12 screening_answers records change? Why or why not? Which design decision from Chapter 9 makes this safe

The screening_answer records would not change if we are storing them as question: answer pairs. But if we use question hash-keys instead these records would be updated. This design decision makes the record safe.

```

```