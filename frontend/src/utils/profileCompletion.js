export const calculateProfileCompletion = (
  profile,
  skills = [],
  education = [],
  projects = [],
  certifications = []
) => {
  let score = 0;

  if (profile?.headline) score += 10;
  if (profile?.bio) score += 10;
  if (profile?.linkedin_url) score += 10;
  if (profile?.github_url) score += 10;

  if (skills.length > 0) score += 20;
  if (education.length > 0) score += 20;
  if (projects.length > 0) score += 10;
  if (certifications.length > 0) score += 10;

  return Math.min(score, 100);
};