## (1) What is a container, and how is it different from an image?

A container is a running instance of an image. The image is a read-only template built from a Dockerfile, while the container is the active process created from that template.

A container runs the application in an isolated environment (process, filesystem, network, environment variables), based on the image.

---

## (2) Why run these services in Docker rather than installing them natively — name a failure it prevents.

Installing these services in Docker instead of natively ensures environment consistency across machines.

It prevents the “works on my machine” problem by standardizing:
- OS-level dependencies
- service versions (e.g., database versions)
- runtime configuration

It also reduces dev-prod parity issues, since production and development run the same containerized setup.

Additional benefit:
- isolation between services and their dependencies

---

## (3) What does a volume protect you from, and what's the difference between `docker compose down` and `docker compose down -v`?

A Docker volume protects data from being lost when a container stops or is removed. It stores data outside the container’s lifecycle, so the data persists even if the container is recreated.

### Difference:

- `docker compose down`
  - stops containers
  - removes containers and network
  - keeps volumes intact (data preserved)

- `docker compose down -v`
  - stops containers
  - removes containers and network
  - deletes volumes as well (data loss)

---