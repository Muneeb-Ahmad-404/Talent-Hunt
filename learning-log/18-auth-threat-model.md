1- An access token is valid for 15 minutes. A recruiter's account is compromised at 09:00. The attacker is detected and the admin revokes the refresh token at 09:08. The attacker's access token was issued at 09:00. What can the attacker do between 09:08 and 09:15 — and what can they not do? Write this out in your own words.

Between the 9:08 and 9:15 the attacker can do about anything from viewing information associated with the compromised account to creating deleting or updating posts etc.. What it cannot do is requesting a new access token after 9:15.

---

2- You are designing a new endpoint: POST /auth/logout. The client sends its refresh token. What does the server need to do — and what does it not need to do — to fully terminate the session?

To terminate the session the server deletes the refresh token so that no new access token is generated against it the server does not need to delete the access token it can expire naturally.