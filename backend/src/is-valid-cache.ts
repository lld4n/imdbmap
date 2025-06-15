export function isValidCache(created?: number): boolean {
  if (!created) {
    return true;
  }

  const now = new Date().getTime();
  const timeout = 30 * 24 * 60 * 60 * 1000;

  if (now - created < 30 * 24 * 60 * 60 * 1000) {
    return true;
  }

  return false;
}
