import { useCallback, useEffect, useState } from "react";

interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<void>;
}

/**
 * Generic hook for handling async API calls with loading and error states
 * @param asyncFunction - The async function to execute
 * @param immediate - Whether to execute immediately on mount (default: true)
 *
 * @example
 * const { data, loading, error, execute } = useAsync(
 *   async () => await api.fetchData(),
 *   true
 * );
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
    } catch (e) {
      const error = e instanceof Error ? e : new Error("An error occurred");
      console.error("API call failed:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute };
}
