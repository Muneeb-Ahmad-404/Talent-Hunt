plainto_tsquery stems words using the English dictionary — "engineering" and "engineer" both become 'engin'. This means a search for "engineering" also matches jobs that contain only "engineer". Explain whether this is desirable behaviour for a job board search. Describe a case where stemming causes a false positive that would frustrate an applicant, and propose how you would address it without disabling the English dictionary entirely.

This behavior is although preffered still cause false postives. Forexample a search of marketing jobs can show results of stock market as the trimmed marketing-> market looks same for both. 
To avoid these false postives we can either use full phrase searches but these would be too rigid and not ux friendly. Another approach is to rank the searches and display the relevant ones on top(the high ranking ones) this one is the best to avoid false positives and have that flexibility too.

The search_vector column is populated by a BEFORE INSERT OR UPDATE trigger. A developer proposes an alternative: compute to_tsvector(title || ' ' || description) inline in the WHERE clause at query time instead of storing it in a column. Compare these two approaches on: query performance, index usage, and what happens when the indexing logic needs to change (e.g., adding a location column to the vector).

Aspect	           Stored tsvector           Computed Inline
Query Performance: Fast (uses GIN index)	 Slow (full table scan)
Index Usage:       Uses GIN index	         Cannot use GIN index (computed at query time)
Changing logic:	   Need to update all rows	 Just change the query
Storage:           Uses extra space          No extra storage
Write performance: Slight overhead           No overhead
Flexibility:       Fixed columns	         Can change anytime

Incase of frequent changes and large tables go with stored tsvector and if changes are not so frequent and need flexibility go with inline.