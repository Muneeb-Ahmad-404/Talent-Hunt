### Schema Design

| User | Company | Applicant | Recruiter | Admin |
| :--- | :--- | :--- | :--- | :--- |
| `id` (PK) | `id` (PK) | `id` (PK) | `id` (PK) | `id` (PK) |
| `email` (Unique) | `name` | `user_id` (FK $\rightarrow$ User) | `user_id` (FK $\rightarrow$ User) | `user_id` (FK $\rightarrow$ User) |
| `password` | `slug` | `full_name` | `company_id` (FK $\rightarrow$ Company) | |
| `role` | `website` | `headline` | `company_role` | |
| `status` | `verified` | `location` | | |
| | `suspended` | `attributes` | | |

---
```sql
CREATE TABLE companies (
  id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text    NOT NULL,
  slug       text    NOT NULL UNIQUE,   -- URL-friendly: 'acme-corp', 'nova-labs'
  website    text,
  verified   boolean NOT NULL DEFAULT false,
  suspended  boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE recruiters (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_id   uuid NOT NULL REFERENCES companies(id),
  company_role text NOT NULL DEFAULT 'recruiter'
                 CHECK (company_role IN ('owner', 'hr_manager', 'recruiter', 'hiring_manager')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE applicants (
  id         uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid  NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name  text  NOT NULL,
  headline   text,
  location   text,
  attributes jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admins (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### (1) A teammate proposes a single users table with nullable company_id, full_name, and headline columns — everything in one place. What is the specific schema-level problem? (Think: what does full_name = NULL on a recruiter row mean to the database's ability to enforce correctness?)
It would result in too much redundant and cluttered data, as fields that are not common across roles would sit as NULL values for records that do not use them, forcing the application to manually parse and type-narrow the data every time. 

Beyond this, the primary schema-level failure is the complete loss of data integrity constraints. Because different roles require different fields, we lose the ability to enforce strict `NOT NULL` constraints at the database layer (e.g., a recruiter row could accidentally be inserted with a `NULL` name or a missing `company_id`). The database can no longer guarantee the structural correctness of your data, shifting the entire burden of data safety onto the application code.

---

### (2) A company has eight recruiters. The admin suspends the company. Walk through exactly what needs to happen in the database — which tables, which rows, which columns. Why is a companies table the right place to put the suspended flag?
To suspend the company, only a single row needs to change in the entire database: the `suspended` column in the `companies` table for that specific company's primary key (`id`) is flipped to `true`. 

The `companies` table is the correct place for this flag because it acts as the single source of truth. Since recruiters are linked to a company via a `company_id` foreign key, the application's authentication system can simply traverse the relationship during login to check the associated company's status. If the flag were instead placed on the `recruiters` table, we would be forced to run heavy batch updates across multiple rows and tables, introducing the risk of data inconsistency if a recruiter row is missed or added later.

---

### (3) Why does ON DELETE CASCADE appear on recruiters.user_id but not on recruiters.company_id? What would happen if you added CASCADE to the company FK?
`ON DELETE CASCADE` belongs on `recruiters.user_id` because a recruiter profile is a direct extension of a core user account; if the parent user account is deleted, the child profile has no reason to exist and should be cleaned up automatically. 

Conversely, we do not want to automatically delete recruiter profiles just because a company entity is removed. If you added `CASCADE` to the company foreign key, deleting a company would cause the database to instantly wipe out all associated recruiter profile rows. Because cascades only flow downward from parent to child, the deletion would stop at the `recruiters` table and would *not* delete the corresponding records in the `users` table. This would leave behind orphaned "ghost" users who are marked with a recruiter role but have no matching profile data, fundamentally breaking application logic.