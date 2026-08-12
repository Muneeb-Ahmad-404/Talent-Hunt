A product manager requests a "total results" count alongside each page — for example, "Showing 20 of 347 jobs". Explain why this is expensive to add with cursor pagination. Describe two implementation strategies: one that provides an exact count and one that provides an approximate count. What are the performance and UX trade-offs of each?

Finding the exact count slows us down if the database is larger because the db would have to go through all the rows for an exact count. But if we make an estimate or use cache etc the performance increases but the ux deteriorates as that estimate could be wrong the cache could be stale etc.

Cursor pagination gives the client an opaque token that cannot be shared as a human-readable URL. A developer proposes encoding page number in the cursor ("page=3") so that the URL ?cursor=cGFnZT0z still corresponds to "page 3" even after decoding. Evaluate whether this is still cursor pagination or offset pagination with extra steps. What is lost by this approach?

Its just offset pagination with extra step so an insult on injury. We are performing bad and loosing ux friendliness both at the same time now.