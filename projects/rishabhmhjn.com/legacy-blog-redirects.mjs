const legacyPostSlugs = [
  '100daysofcode-day-1-taking-the-first-step',
  '100daysofcode-day-2-nx-monorepo',
  '100daysofcode-day-3-shared-eslint-plugin',
  '100daysofcode-day-4-break-in-the-challenge-ng-scaffolding',
  '100daysofcode-day-5-shared-styles-in-nx-angular-libraries',
  'amritsar-startup-manifesto',
  'co-working-in-amritsar-cases-for-and-against',
  'cracking-competitive-exams-is-easier-now-than-before',
  'ghost-theme-development-environment-with-docker',
  'levels-of-politeness',
  'local-govt-in-punjab-pushing-back-on-online-classes',
  'million-dollar-startups-from-tier-2-indian-cities',
  'rise-of-shallow-and-desperate-mentors',
  'tools-and-resources-for-startups',
];

export const legacyBlogRedirects = Object.fromEntries(
  legacyPostSlugs.map((slug) => [`/${slug}/`, `/blog/${slug}/`])
);
