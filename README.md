# Talent-Hunt

A full-stack job portal built with a focus on backend engineering, data integrity, authentication, authorization, and reliable application workflows.

Talent-Hunt supports applicants looking for jobs, recruiters managing company job listings, and administrators overseeing platform activity. The project explores the engineering decisions required to build a backend beyond basic CRUD operations.

## Features

- **Role-based access control:** Separate permissions for applicants, recruiters, and administrators.
- **Authentication:** JWT access and refresh token flows.
- **Multi-tenant authorization:** Company-scoped access controls and ownership validation to prevent unauthorized cross-tenant access.
- **Job management:** Create, update, browse, and search job listings.
- **Applications:** Manage job applications and their progression through the recruitment process.
- **Database integrity:** PostgreSQL foreign keys, constraints, migrations, and transactions.
- **Efficient querying:** Cursor-based pagination, composite indexes, SQL joins, and full-text search.
- **Caching:** Redis caching for frequently accessed data, with expiration and invalidation.
- **Resume uploads:** S3-compatible object storage and presigned upload URLs.
- **Background jobs:** BullMQ workers for asynchronous tasks, with retry handling.
- **Recruitment workflows:** Company invitations, interview scheduling, feedback, and application-stage management.
- **Operational tooling:** Structured logging, rate limiting, health checks, graceful shutdown, and containerized services.

## Tech Stack

| Component | Technology |
|---|---|
| Backend API | Node.js, Express |
| Database | PostgreSQL |
| Caching and job queues | Redis, BullMQ |
| Frontend | Next.js |
| Object storage | MinIO / S3-compatible storage |
| Deployment and local infrastructure | Docker, Docker Compose, Nginx |

## Architecture

The backend separates API request handling from asynchronous background processing.

- **Express API:** Handles incoming requests, authentication, authorization, validation, and business logic.
- **PostgreSQL:** Stores relational application data and enforces database-level integrity constraints.
- **Redis:** Supports caching and background job queues.
- **BullMQ workers:** Process asynchronous tasks outside the main request-response cycle.
- **Object storage:** Stores uploaded resumes without placing file contents directly in the relational database.
- **Next.js frontend:** Provides the user interface for the job portal.
- **Docker Compose:** Coordinates the services required for local development.

## Backend Engineering Decisions

### Database design and integrity

PostgreSQL was selected because the application's users, companies, recruiters, jobs, and applications have strong relational dependencies. Foreign keys and database constraints help enforce these relationships consistently.

Indexes are designed around common query patterns, including status-filtered job listings, company-scoped queries, and cursor pagination.

### Authentication and authorization

Authentication identifies the user making a request, while authorization determines which resources that user can access. The backend uses role-based permissions alongside resource ownership and company-scoped checks.

These checks are particularly important in a multi-tenant application, where a valid user must not automatically gain access to another company's resources.

### Query performance

Cursor-based pagination provides a way to navigate large result sets without relying on increasingly large offsets. Composite indexes support the filtering and ordering patterns used by common queries.

PostgreSQL full-text search and Redis caching address different performance needs: search operates on indexed database content, while caching reduces repeated work for frequently requested data.

### Reliable background processing

BullMQ moves suitable tasks out of the main request-response cycle. Retry policies help recover from transient failures, while idempotency safeguards are important wherever a task or request might be repeated.

### File uploads and storage

Resume files are stored in S3-compatible object storage. Presigned URLs allow controlled uploads without routing every file byte through the application server.

## Running Locally

The project uses Docker-based infrastructure for local development.

### Prerequisites

- Git
- Docker
- Docker Compose

### Setup

Clone the repository:

```bash
git clone https://github.com/Muneeb-Ahmad-404/Talent-Hunt.git
cd Talent-Hunt
```

Configure the required environment variables using the example environment files provided in the repository, if available. Do not commit secrets or production credentials.

Start the services using the repository's Docker Compose configuration:

```bash
docker compose up --build
```

If the repository uses a different Compose file, environment setup process, or startup command, follow those project-specific instructions instead.

## Project Status

The project has a substantial backend implementation and a partially completed Next.js frontend. It is containerized for local development but is not currently hosted as a public production application.

## Further Reading

I documented the reasoning behind the database design, authentication, authorization, query performance, background processing, and deployment decisions in a technical article.

- **Technical article:** [Building a Job Portal Backend: From Database Design to Deployment](https://dev.to/muneeb_ahmad_18a2b2f10a70/building-a-job-portal-backend-from-database-design-to-deployment-3e75)
- **Repository:** [Muneeb-Ahmad-404/Talent-Hunt](https://github.com/Muneeb-Ahmad-404/Talent-Hunt)

## Author

**Muneeb Ahmad**

- GitHub: [@Muneeb-Ahmad-404](https://github.com/Muneeb-Ahmad-404)
- LinkedIn: [Muneeb Ahmad](https://www.linkedin.com/in/muneeb-ahmad-se/)
