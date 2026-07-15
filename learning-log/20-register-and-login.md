## 1. Why does register return 201 and login return 200?

HTTP 201 Created means a new resource came into existence as a direct consequence of the request. Registering creates a user row that did not previously exist — 201 is the correct signal. A client or cache that understands HTTP knows the request produced a new resource.

HTTP 200 OK means the request succeeded. Login does not create anything. It checks credentials against an existing record and returns a representation of that identity. No row is inserted. Returning 201 for login would be wrong: it would imply something was created, which it was not. Clients that follow Location headers on 201 responses or that track created resources would behave incorrectly.

The distinction is not cosmetic. It is semantic — it tells any HTTP-aware client what the operation did.

----

## 2. A recruiter forgets their password. The current system has no "forgot password" flow. What would it need?

At the service layer, the flow requires generating a short-lived, single-use token — a random opaque string (not a JWT) tied to the user's ID and an expiry timestamp. That token must be stored somewhere the application can look it up later: either in a new password_reset_tokens table (id, user_id, token_hash, expires_at, used_at) or in Redis with a TTL.

The email flow: the API receives POST /auth/forgot-password with an email address. If the address is registered, the service generates the token, stores it, and queues an email containing a reset link (e.g. https://portal.dev/reset-password?token=<token>). The response is always 200 regardless of whether the email is registered — returning 404 for unknown emails enables email enumeration. The user sees "If that email is registered, you'll receive a link shortly."

The reset step: the user clicks the link. The frontend sends POST /auth/reset-password with { token, newPassword }. The service looks up the token hash (you store the hash, not the raw token, for the same reason passwords are stored as hashes — if the token table is leaked, raw tokens are usable), confirms it is not expired and not already used, fetches the associated user, calls hashPassword(newPassword), updates password_hash, marks the token as used, and returns 200.

Table change needed: password_reset_tokens with at minimum token_hash, user_id, expires_at, used_at. Alternatively, use Redis with a SETEX key per token — simpler, automatically expires, no table migration required, but loses the audit trail.

