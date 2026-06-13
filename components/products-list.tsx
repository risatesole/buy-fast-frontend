"use client";

import { useEffect, useRef, useState } from "react";
import { Product } from "@/types/products";

type ProductsPage = {
  next: string | null;
  previous: string | null;
  results: Product[];
};

type ProductsListProps = {
  initialData: ProductsPage;
};

/**
 * Renders a product list that automatically loads
 * additional pages as the user scrolls.
 */
export default function ProductsList({
  initialData,
}: ProductsListProps) {
  const [products, setProducts] = useState(initialData.results);
  const [nextPageUrl, setNextPageUrl] = useState(initialData.next);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  /**
   * Fetches the next page and appends it to the list.
   */
  const fetchNextPage = async () => {
    if (!nextPageUrl || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(nextPageUrl);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const page: ProductsPage = await response.json();

      setProducts((currentProducts) => [
        ...currentProducts,
        ...page.results,
      ]);

      setNextPageUrl(page.next);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;

    if (!trigger) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(trigger);

    return () => observer.disconnect();
  }, [nextPageUrl, isLoading]);

  return (
    <>
      <pre>{JSON.stringify(products, null, 2)}</pre>

      <div ref={loadMoreTriggerRef} />

      {isLoading && <p>Loading...</p>}

      {!nextPageUrl && <p>No more products.</p>}
    </>
  );
}