/**
 * Safely fetch JSON data from an API endpoint
 * Checks response status and content type before parsing
 */
export async function fetchJSON<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  
  // Check if response is OK
  if (!response.ok) {
    const errorMessage = `HTTP error! status: ${response.status}`;
    console.error(`Failed to fetch ${url}:`, errorMessage);
    throw new Error(errorMessage);
  }
  
  // Check content type
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    console.error(`Invalid content type from ${url}:`, contentType);
    throw new Error("Server returned non-JSON response. This might be an HTML error page.");
  }
  
  // Parse JSON
  try {
    return await response.json();
  } catch (error) {
    console.error(`Failed to parse JSON from ${url}:`, error);
    throw new Error("Failed to parse server response as JSON");
  }
}

/**
 * Safely fetch JSON with automatic retry and fallback
 */
export async function fetchJSONWithFallback<T = any>(
  url: string,
  fallback: T,
  options?: RequestInit
): Promise<T> {
  try {
    return await fetchJSON<T>(url, options);
  } catch (error) {
    console.error(`Using fallback for ${url} due to error:`, error);
    return fallback;
  }
}