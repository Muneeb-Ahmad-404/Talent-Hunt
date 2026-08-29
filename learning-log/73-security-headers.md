Look at the full list of headers returned by curl -I http://localhost:3000/health before and after adding Helmet. Write down every header that is new. For each one, look up its purpose in the MDN Web Docs and write one sentence explaining what attack it mitigates.

These are the new headers: 

 ## New Headers from Helmet

| Header | Purpose | Attack Mitigated |
|--------|---------|------------------|
| **Content-Security-Policy** | Restricts which resources can be loaded | XSS — prevents inline scripts and loading malicious resources |
| **Cross-Origin-Opener-Policy** | Prevents cross-origin window sharing | Cross-origin attacks — stops malicious sites from accessing your window |
| **Cross-Origin-Resource-Policy** | Restricts cross-origin resource loading | Data exfiltration — prevents other sites from reading your resources |
| **Origin-Agent-Cluster** | Isolates origin in separate process | Memory/CPU attacks — prevents cross-origin side-channel attacks |
| **Referrer-Policy** | Controls what referrer info is sent | Information leakage — prevents leaking URL paths to third parties |
| **Strict-Transport-Security** | Forces HTTPS connections | Man-in-the-middle — prevents SSL stripping attacks |
| **X-Content-Type-Options** | Prevents MIME type sniffing | MIME confusion attacks — stops browsers from executing malicious files |
| **X-DNS-Prefetch-Control** | Controls DNS prefetching | Information leakage — prevents leaking sensitive data via DNS requests |
| **X-Download-Options** | Prevents automatic file downloads | Malicious file execution — stops automatic downloads of harmful files |
| **X-Frame-Options** | Prevents clickjacking | Clickjacking — stops your site from being embedded in malicious frames |
| **X-Permitted-Cross-Domain-Policies** | Controls cross-domain policies for Flash/PDF | Information leakage — restricts access from legacy plugins |
| **X-XSS-Protection** | Controls browser XSS filter (deprecated, but still set) | XSS — legacy protection for older browsers |

---

CORS is a browser mechanism — curl ignores it completely. Demonstrate this: call curl -H "Origin: http://evil.com" http://localhost:3000/api/jobs. The request succeeds. Write down why CORS alone is not sufficient to protect the API and what mechanism provides the real protection for authenticated endpoints.

Succeeds using curl. It can only be protected through explicit checks at different stages. 

The real protection for authenticated endpoints is:
 - Authentication middleware (authMiddleware) — verifies the JWT token
 - Authorization checks (requireRole) — ensures the user has the correct role
 - Input validation — prevents injection attacks
 - Rate limiting — prevents brute-force attempts
 - Database-level isolation — ensures users only access their own data

