getRecruiterCompany is called on every request to a company-scoped route. For a busy system this could mean one extra database round-trip per request. What strategies would you use to reduce or eliminate this overhead — and what are the trade-offs of each in terms of isolation guarantees?

We can cache the company id with a small ttl but there still would be misses and db calls.
Or we could add it in the jwt but that could raise some security concerns.

The getMyCompany function calls getCompanyById after getRecruiterCompany. Could these two queries be combined into a single SQL statement? Write the SQL. What are the advantages and disadvantages of the combined approach versus the two-step approach?

Joining the two can reduce the queries to one but it would result in loss or readability, manageability, testability etc and increase complexity. On the other hand the two step approach is good with all these but makes two calls.