1- You want to increase the cost factor from 12 to 13 next quarter, as hardware has gotten faster. hashPassword calls bcrypt.hash(plaintext, BCRYPT_ROUNDS) and verifyPassword calls bcrypt.compare(plaintext, hash). After you change BCRYPT_ROUNDS to 13 and redeploy: new registrations produce cost-13 hashes. Existing users have cost-12 hashes stored in the database. What happens when an existing user logs in — does verifyPassword break for them, and why or why not?

For each hash the number of rounds is stored in the hash code at the start so an already stored hash would be compared based on the rounds its hash has and not the updated ones to verify whilst to create new hashes 13 rounds would be used. So the verify password does not break.

---

2- The register route calls await hashPassword(body.password) before inserting the user row. If two requests arrive at exactly the same millisecond — two people registering simultaneously — are those two hashPassword calls a problem? What would be a problem, and what is the correct way to check for that?

There wont be any conflict unless both requests have the same email in that case it would cause a problem as for both the check for if email exists return false. So we need a db level check that returns the 409 error which then should be catched by the program and displayed in a user friendly way.