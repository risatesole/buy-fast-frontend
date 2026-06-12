import { useEffect, useRef, useState, useCallback } from 'react';

type UseInfiniteScrollOptions = {
  onLoadMore: () => Promise<void>;
  threshold?: number;
};

export function useInfiniteScroll({
  onLoadMore,
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onLoadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          handleLoadMore();
        }
      },
      { threshold }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleLoadMore, isLoading]);

  return { observerTarget, isLoading };
}
