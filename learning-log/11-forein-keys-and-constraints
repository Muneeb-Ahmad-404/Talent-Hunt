# 11: Foreign Keys and Constraints

## The Applicant Account Deletion Problem

If an applicants account is deleted by the applicant or the admin then all the associated applications would be deleted so there won't be any historical reference all the related data would be deleted. If we use restrict on applications.applicant_id the database blocks the deletion if applications exist, forcing the application layer to explicitly execute a choice before proceeding. The first path manually deletes applications (hard-delete) while the second updates them to clear personal data (anonymise).

---

## Validation Layer vs. CHECK Constraints

The check if a job deadline is in the future instincively seems to be the part of db validation but as it relies on a changing current date and would lock historical rows from updates, the application layer should validate it.

---

## Architectural Decisions & Safety Analysis

### Which FK decision in this chapter required the most careful reasoning? What does RESTRICT protect against in that specific case?
The decision of hard-deleting or keeping the applications on deleting the applicant required critical reasoning. Restrict forces us manage the data in application layer by blocking accidental database-level wipes of historical application records.

### Describe a scenario in this portal where a developer might feel tempted to add ON DELETE CASCADE to a FK that this chapter classifies as RESTRICT. What would happen if they did?
A developer might feel tempted to add ON DELETE CASCADE to applications.job_id so deleting a job automatically cleans up child rows. If they did, deleting a job would silently and permanently wipe out the submission history on applicants' personal dashboards without their consent.