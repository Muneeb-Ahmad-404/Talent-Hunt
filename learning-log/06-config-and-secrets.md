### (1) Why does configuration belong in the environment rather than in code — give the two failures it prevents.

It seperates the core logic from input validation, seperating config from code made tracking problems related to the config easier. It prevents the problems associated with input type and if the value is added or not. Hardcoding them leads to security breaches and environment inflexibility.

---

### (2) Why validate config and fail fast at startup instead of reading process.env where you need it — describe the bad outcome fail-fast avoids.

Using config to validate helps us setup validation logic at one place and to fail-fast incase of any problem with the variables that are too difficult to detect in anyother case. In case of reading process.env everywhere first off we would need to implement validation everywhere (using zod everywhere). Also if we are to use typescript only that validation is no more there in production.

---

### (3) What is .env.example for, and why is it safe to commit when .env is not? Commit it.

Its an example file for the environment variables to tell the repo cloner which vars to add. It just contains the structure of the vars so is safe to commit.

---