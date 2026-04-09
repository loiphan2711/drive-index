/**
 * Validates and returns a safe path for navigation, defaulting to dashboard.
 * @param {string | null} candidate - The path to validate
 * @returns {string} Safe path (candidate or '/dashboard')
 */
export const getSafeNextPath = (candidate: string | null): string => {
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) {
    return '/dashboard';
  }

  return candidate;
};
