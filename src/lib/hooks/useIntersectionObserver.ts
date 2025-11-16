import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): {
  ref: React.RefObject<HTMLDivElement>;
  entry: IntersectionObserverEntry | null;
  isIntersecting: boolean;
} {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = ref.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      { threshold, root, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, frozen]);

  return {
    ref,
    entry,
    isIntersecting: !!entry?.isIntersecting,
  };
}
