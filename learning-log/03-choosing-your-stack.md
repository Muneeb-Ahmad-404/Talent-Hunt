# Part A — The decision

## Your stack, recorded
List the tool you chose for each slot — web framework, database access (ORM/query builder), validation library — plus the given base (Node + TypeScript, PostgreSQL, Redis, BullMQ, S3-compatible storage). One sentence each on why and what you traded away.

### Web framework
**Express**  
chosen because of control it offers around middlewares, validations, api calls etc, and because of its overall speed and familarity.  
tradoff is fast development time, maintainability, inconsistency structure( bcuz of manual work)

### Database Access
**ORM**  
Choosen because of faster development and higher abstraction and for it being a maintainable way as it is easily readable for new devs etc.  
Tradeoff is the faster query times more control over your db and making custom queries etc..

### Validation library
**zod**  
Choosen because it enforces type safety in runtime with ease from the defined ts types so no need to write seperate manual validation and risk inconsistencies.  
Tradeoff is runtime overhead, maintainance can become tough, changing schema's can be a headache across the projects

## The pick you debated most
Which decision was closest, and what tipped it? (If none felt close, you may not have weighed the alternatives hard enough — go back to that one.)

I debated between ORM and raw sql as raw sql provides the utmost control and speed for the application but the development time, maintainability of code would have been a little tougher besides that the code consistency would have taken a hit too. So for maintainability and code consistency I opted for ORM with higher abstraction and traded off the query efficiency.

---

# Part B — The concepts it rests on

## TypeScript vs JavaScript
Give one concrete bug in your job portal that TypeScript catches before runtime but plain JavaScript would let reach an applicant.

Typescript enforces typesafety during development while javascript doesnot which can help in preventing problems escape to be more dangerous in the future.  
For queries with no ids javascript would assign nan to it and the program would keep running with that causing problems for later, while typescript detects that the type is not what was enforced and would point out the error and can also pin pint the issue that caused this.

## The framework axis
Explain the "minimal ↔ batteries-included" axis in your own words, and say where your chosen framework sits and why that suits this project.

The axis is how much the framework does for you by default. On the minimal side, the framework only gives core web primitives like routing and middleware and leaves structure, conventions, and architecture decisions to you; on the batteries-included side, it gives built-in modules, dependency injection, conventions, and a predefined project structure.  
My choosen framework express exists at the minimal side, it only provides the core primitives but leaves the decisions to you.

## The database-access spectrum
Explain raw SQL vs query builder vs ORM. Then describe the specific danger of leaning on a full ORM without watching the SQL — name the problem it tends to hide.

raw sql is closest to the database level abstraction and needs us to write manual queries  
query builder has slight abstraction but the style is close to the raw sql with more readability  
orm has the highest level of abstraction among all and have standard set of queries instead of custom ones.

Using full ORM in a project can lead to slower queries because of the n+1 problem, as compared to the sql one's where we can write custome join queries and get more speedy responses.

## Runtime validation
Explain why TypeScript types aren't enough to validate an incoming request, in terms of when types exist. What does a schema library (zod) give you that the type system cannot?

Typescript only validates the types during development. During the run time typescript types are dropped and does not matter, so the validation is gone in production. A schema library like zod enforces the type validation during the run time to validate inputs.

## Redis's double duty
Name the two distinct jobs Redis does in this stack, and which later module uses each.

Cache: Redis acts as a cache to store the data that should be read quickly without going to the server.  
Queue: Redis acts as a job queue for asynchronous jobs such as email, report generation etc.