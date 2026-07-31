assertJobOwnership throws NotFoundError when company_id !== companyId. The job exists in the database — the server knows it exists. Returning 404 in this case is technically a lie. Write a one-paragraph argument for returning 403 instead (revealing existence, hiding content) and a one-paragraph argument for returning 404 (hiding existence entirely). Which would you choose for this system, and why?

A 403  error provides the user a clear cut response that you are not allwoed to access that particular resource saving him tries for rechecking the path etc...

A 404 error although keeps the user in dark but it prevents the attackers to know of the existance of resource/job that does not belong to him. or his company.

I will choose 404 as it prevents the tiny information leak that occurs in case of 403, that is confirming the existance of a job.

The ownership check pattern runs a SELECT on every request to verify ownership before proceeding. For write operations (PUT, DELETE), this means the record is fetched twice: once for the ownership check and once for the actual update. How could you restructure the database query to perform the ownership check and the write in a single round-trip? Write the SQL for DELETE FROM jobs WHERE id = $1 AND company_id = $2 and describe what the affected row count tells you.

The distinction between "not found" and "wrong company" is lost both return rowCount of 0. This is acceptable because the response should be the same (404) to prevent enumeration.