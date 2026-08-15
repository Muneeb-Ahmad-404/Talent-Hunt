The presigned URL flow means the API server never sees the file bytes. A security engineer asks: "How do you prevent an applicant from uploading a malicious executable disguised as a PDF?" Describe two concrete countermeasures — one that can be implemented without routing file bytes through the API server, and one that requires inspecting bytes. What is the cost of each?

The first method would be to add ui side validation to restrict file types before upload. This is a low cost low effort solution but can be easily bypassed through postman or curl etc.
The second solution requires routing file bytes and reject malicious files, it needs s3 calls, and overall byte reading so is slower, high cost but is secure.

The confirm step (POST /api/applicants/profile/resume) trusts the client to report the correct filename. A malicious client could send filename: "../../etc/passwd". Why does this particular filename not cause a path traversal vulnerability in the current implementation? Under what circumstances would it become a problem?

In the current setting its not a problem as the file name is not being used to create dir. Its being used as a name. But if the name had been used in path commands etc.. then it would have been a vulnerability waiting to be exploited.