Think about a job board action that would be a good fit for a background job but was not mentioned in this chapter. Write down what the job payload would contain, why it should be async, and what "idempotent" means for that specific job.

Suspending a company and then concurrently closing the associated jobs is a good fir for a backendjob. The job payload would contain the job_ids associated with the company. It should be async because it can take some time if there are too many jobs wasting time and effecting ux. For this specific task/job idempotent means that closing a job twice bear the same result and that is its deleted. No error is given in case of already deleted jobs its handled gracefully.

---

Sketch a sequence diagram (boxes and arrows on paper) showing what happens when an applicant submits an application from the moment they click "Apply" to the moment the confirmation email lands in their inbox. Label each arrow as either "synchronous" (inside the HTTP request) or "asynchronous" (outside the HTTP request).

Apply -> profile snapshot taken -> db entry -> email sent . All imo need to be sync but we can go with email as async.