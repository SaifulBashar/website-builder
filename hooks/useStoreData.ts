import { useCallback } from 'react';
import { useWebsiteStore } from '@/store';

/**
 * Custom hook for managing store data operations
 */
export function useStoreData() {
  const { fetchAndUpdateStore, isLoading, error, databaseId, setDatabaseId, website } =
    useWebsiteStore();

  /**
   * Fetch data from API and update the store
   */
  const fetchData = useCallback(
    async (pageId: number) => {
      try {
        await fetchAndUpdateStore(pageId);
        return true;
      } catch (error) {
        console.error('Failed to fetch data:', error);
        return false;
      }
    },
    [fetchAndUpdateStore]
  );

  /**
   * Set the database ID and optionally fetch data immediately
   */
  const setPageId = useCallback(
    async (pageId: number, autoFetch = true) => {
      setDatabaseId(pageId);
      if (autoFetch) {
        return await fetchData(pageId);
      }
      return true;
    },
    [setDatabaseId, fetchData]
  );

  return {
    // State
    website,
    isLoading,
    error,
    databaseId,

    // Actions
    fetchData,
    setPageId,
    setDatabaseId,
  };
}
