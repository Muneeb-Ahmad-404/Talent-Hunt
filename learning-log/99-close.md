Without looking at any code, write down every table in the database from memory, in the order they would need to be created (respecting foreign key dependencies). Then check your answer against the migration files. This exercise tests whether the schema is fully internalized.

companies -> users -> applicants -> recruiters -> admins -> invitation -> jobs -> applications -> refresh_tokens -> email-verification -> resumes -> shortlist-items -> interviews 

Draw the complete request lifecycle for POST /api/applications on paper: from the TCP connection arriving at nginx, through every Express middleware, into the service and repo layers, into PostgreSQL and Redis, through the BullMQ worker, to the email arriving in the applicant's inbox. Label every arrow with the protocol or mechanism used.

1- tcp to nginx

2- nginx to express api

3- express middleware chain

4- auth middleware chain

5- requirerole function call

6- route layer -> service layer

7- service layer -> repo layer

8- repo -> postgresql

9- repo -> redis                        10- service -> bullmq queue

11- service -> reponse -> routes        12- bullmq worker -> picks up task

13- routes -> express -> nginx          14- worker -> mailer

                                        15- mailer -> smtp server
                                        
                                        16- smtp server -> applicant email.

---

Run the full 30-step checklist from start to finish in one sitting without looking at any chapter files. Write down the step numbers where you needed to look something up. Those gaps are the topics to review before calling the course complete.

**looked up:**
- Removing `full_name` column from migration and database
- Commented-out `/applications` route in `applicants.routes.ts`
- `verified` → `status` change in `companies.repo.ts`
- `process.env.NODE_ENV` → `config.NODE_ENV` in `publicRouter.ts`
- Trailing slash mismatch (`/api/applications/` vs `/api/applications`)

**Review: migration modifications, route mounting, schema updates, config usage.**

---

Explain the system to a junior developer who just joined the team. Cover: what the system does, why PostgreSQL + Redis are both needed, what the worker does and why it is a separate process, and how a request flows from the browser to the database and back. Time yourself — if you cannot explain it in 10 minutes, revisit the concept chapters.

**A job portal with 3 roles:** applicants browse/apply, recruiters post jobs/manage applications, admins moderate companies. **PostgreSQL** stores all data with ACID transactions and foreign key constraints. **Redis** caches job board pages, manages rate limits, and powers BullMQ background jobs. **Worker** runs separately to send emails, process resumes, and clean up expired tokens—so the API responds instantly. **Request flow:** browser → Nginx (HTTPS) → Express middleware (auth, role guard) → service layer (business logic) → repository (data access) → PostgreSQL/Redis → response back through middleware → browser, with async jobs going to BullMQ worker for email delivery.