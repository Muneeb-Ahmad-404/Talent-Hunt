### 1. Why does verifyAccessToken throw UnauthorizedError for both expired and tampered tokens, when the causes are different?

From the client's perspective, both conditions mean the same thing: re-authenticate. Whether the token is expired or forged, the correct client response is to either refresh (Chapter 22) or redirect to login. Sending different error codes for expired vs tampered would tell a potential attacker information about the server's token state that provides no benefit to a legitimate client. The distinction matters for server-side logging — log it there — but not for the response body.

--- 

### 2. Why is req.user typed as optional even on protected routes?

TypeScript resolves types statically. It cannot follow the runtime guarantee that authMiddleware either attaches req.user or throws before the handler runs. From TypeScript's static view, a Request arrives at the handler and user may or may not be set, because the type definition allows both. The non-null assertion req.user! is the correct mechanism: you are telling the compiler that you, the developer, know this property is present at this point because of a runtime invariant that the type system cannot see. This is an acceptable use of !; it is not suppressing a genuine uncertainty.