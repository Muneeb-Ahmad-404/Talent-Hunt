export type ApplicationSnapshot = {
  headline: string | null;
  bio: string | null;
  skills: string[];
  resumeKey: string | null;   // s3_key of the most recently uploaded résumé at time of apply
};