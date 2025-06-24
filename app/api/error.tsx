'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // For API routes, we should never return HTML
  // This is a fallback that shouldn't be reached
  return null;
}