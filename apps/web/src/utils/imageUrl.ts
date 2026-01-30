/**
 * Utility function to get the full image URL
 * Handles both absolute URLs and relative paths from the backend
 */
export function getImageUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Get API URL from environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  
  // Remove /api/v1 from the end if present (for uploads path)
  const baseUrl = apiUrl.replace('/api/v1', '');
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Get avatar URL with fallback
 */
export function getAvatarUrl(avatar: string | undefined | null, fallback?: string): string {
  const url = getImageUrl(avatar);
  return url || fallback || '';
}
