The invitation token is SHA-256 hashed before storage. Some teams use bcrypt for invitation tokens instead of SHA-256, arguing that bcrypt's cost factor provides additional protection. Evaluate this argument. Is bcrypt the right choice for this token? Consider the difference between passwords (user-chosen, low entropy) and cryptographic random tokens (system-generated, high entropy) in your answer.

The uer generated password are already predictible so to make them truly random and high entropy and do tackle the brute force attempts bcrypt is used. But for random tokens that are already generated random and are short lived as compared to the password we donot have to worry about the brute force attempts that much, so using sha-256 is sufficient and user friendly in this case.

The check for a pending invitation (findPendingInvitation) and the check for an existing member (findExistingMember) are two separate queries. Could they be combined into a single query? Write the SQL, then explain the trade-off between a combined query and two separate queries in terms of readability and future maintainability.

Seperating the two helps with good UX. We could write a single sql query as
```sql
SELECT 
      (
        SELECT id FROM invitations 
        WHERE company_id = $1 AND email = $2 AND expires_at > NOW() 
        LIMIT 1
      ) AS invitation_id,
      (
        SELECT r.id FROM recruiters r
        JOIN users u ON u.id = r.user_id
        WHERE r.company_id = $1 AND u.email = $2
        LIMIT 1
      ) AS member_id
```
now this approach only queries the database once but now we can't send a specific message based on whether the user is already there or if the invitations is pending making it difficult for the user to understand the issue. On the contrary the current way makes two queries but is we can send specific messages too.