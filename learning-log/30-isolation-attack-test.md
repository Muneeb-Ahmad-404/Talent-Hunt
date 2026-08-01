The attack test uses only manual curl commands. What would be the advantages of automating this test sequence — for example, as a Jest integration test that seeds its own data, runs the attack scenario, and asserts the response codes? What setup complexity would the automated version require that the manual test avoids?

Automating the test sequence will speed up the development and every pr would be tested based on the same sequence of tests without much wait. But the automated version will have a overhead of development of these tests and the jeet integration. We would need to manage data seeding, test isolation, token generation, database setup etc..

The isolation rule comment placed in companies.repo.ts and jobs.repo.ts documents the constraint for future developers. What other mechanisms — beyond comments — could enforce the isolation rule programmatically so that a developer adding a new company-scoped query without the company_id filter would be caught before the code ships?

We could use typescript wrappers with company id but that is compile time check not a runtime check. 
We could use Row level security in database, it is secure is complex to setup and harder to test and debug
We could use linting but that can have false positives, overall provides dev time checks
Or we can make it mandatory at the repository layer and enforce it in integration tests.