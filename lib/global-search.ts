// Build-time configuration for whether mail searches start across all folders.
export function isGlobalSearchEnabled(): boolean {
  return process.env.NEXT_PUBLIC_GLOBAL_SEARCH_ENABLED === 'true';
}
