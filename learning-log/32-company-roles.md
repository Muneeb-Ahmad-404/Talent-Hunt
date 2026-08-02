Q1. An owner changes a member's company role from hr_manager to recruiter. The member has a valid access token that was issued 5 minutes ago and will not expire for another 10 minutes. Under this chapter's design, when does the role change take effect for that member's next API request? Explain why, referencing the JWT structure and the getRecruiterCompany query.

The role change takes effect immediately for the member's next API request specifically, when getRecruiterCompany() is called and fetches the updated role from the database.

Q2. The permission matrix shows that a hiring_manager can "manage applications (stage, feedback)" but cannot post jobs. A developer proposes adding a new company role called senior_recruiter that inherits all recruiter permissions plus the ability to change application stages. Describe what changes would be required across the database, the assertCompanyRole helper calls, and any other application layers to introduce this new role safely.

We would need to add an assertion check across different routes or methods adding the new role in the allowed roles list.

Q3. The assertCompanyRole helper throws ForbiddenError when the caller's role is not in the allowed list. A security reviewer points out that this error leaks information: an attacker who is a recruiter attempting a hiring_manager-only action learns that the endpoint exists and that their role is wrong. Propose an alternative error strategy — and evaluate the trade-off between security and debuggability for internal company users who are legitimately confused about their permissions.

Trade-off Analysis
| Aspect | `403 Forbidden` (Standard Approach) | `404 Not Found` (Stealth Approach) |
| :--- | :--- | :--- |
| **Security** | Leaks endpoint existence to unauthenticated/unauthorized clients. | Hides endpoint existence entirely, mitigating endpoint mapping attacks. |
| **Debuggability** | **Clear:** Explicitly states *"Authenticated, but insufficient permissions."* | **Confusing:** Reports *"Resource not found,"* obscuring whether it is a path error or access issue. |
| **Legitimate Users** | Understands immediately that they need elevated privileges or a different role. | May assume a broken link, missing feature, or system bug. |
| **Internal Support** | **Easy to diagnose:** Log patterns and client error responses clearly indicate access control blocks. | **Harder to debug:** Support teams must cross-reference roles to determine if a route actually exists. |
| **Attackers** | Can map application attack surfaces and identify privileged endpoints. | Cannot distinguish between non-existent routes and restricted resources. |

---