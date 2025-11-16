import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Define a listener function
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Add the listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Common breakpoint hooks
export const useIsMobile = () => useMediaQuery('(max-width: 640px)');
export const useIsTablet = () => useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
