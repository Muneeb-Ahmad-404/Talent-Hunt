1- Look at applications.screening_answers. An alternative design is a separate screening_answers table with columns (id, application_id, question_id, answer). Name one thing the normalized table makes possible that JSONB makes hard or impossible, and name one thing the JSONB approach makes possible that the normalized table makes harder.

The normalized tables would allow for index fields which will allow easier navigation through the tables while the jsonb are of pre-determined structure you need to take in account all the time. The jsonb approach allows the questions and answers to be of different types and to be paired easily. While the normalized tables approach would be strict and won't provide the flexibility of different questions types etc.

---

2- The profile_snapshot column duplicates data from applicants. Describe a scenario where that divergence causes a problem that is not a bug — it is the correct behavior — and a scenario where that same divergence would cause a real bug if it were not handled carefully.

The divergence in case of a job application: you update your profile after some time of applying to a job and the data is now different for application and profile that is the correct behavior as recruiters would need to see your profile at the time of application.

The divergence in case of contact details: you update your contact email and now the application email is different then what your updated email is causing problems.