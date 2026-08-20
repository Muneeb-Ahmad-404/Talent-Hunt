Walk away from the screen and explain to someone (or a rubber duck) why suspending a company must close its jobs in the same service call rather than in a separate admin step. Focus on what a user would see if you did not.

If a company has been suspended due to fradulent activities or any other violations its jobs should be closed to prevent people from getting scammed or from facing other issues from such company. Now to do that we have two options first is to do both tasks in a single step, if that step fails neither the company is suspended nor are its jobs closed. Its perfectly fine cuz admin can see that too and try again. On the other hand if these are divided into two admin steps but still automated the company may get suspended but the jobs could stay open and applicants can engage with those stale jobs and can engage with that potentially fradulent company. Similar is the case if we add it as a manual step the admin  can forget and he can not easily know if the jobs are closed are not.

Draw on paper the three states a company can be in and the transitions between them. Label each arrow with the admin action that triggers it and the SQL UPDATE it runs.

pending --(admin verifies it)--->  verified ---(admin suspends it)--->  suspended

UPDATE companies SET status = 'verified'           UPDATE companies SET status = 'suspended'