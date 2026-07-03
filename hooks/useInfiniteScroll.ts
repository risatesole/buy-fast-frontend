'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type UseInfiniteScrollOptions = {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  threshold?: number;
};

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, onLoadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          handleLoadMore();
        }
      },
      { threshold }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget && hasMore) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [handleLoadMore, isLoading, hasMore, threshold]);

  return { observerTarget, isLoading };
}
