import { Website } from '@/types/blocks';

// API client functions for store data operations

/**
 * Get store data from the API
 * @param pageId - The page ID (bigint) in the database
 * @returns Promise with the store data or null if not found
 */
export async function getStoreData(pageId: number): Promise<Website | null> {
  try {
    const response = await fetch(`/api/pages?id=${pageId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error getting store data:', error);
    throw error;
  }
}

/**
 * Update store data via API
 * @param pageId - The page ID (bigint) in the database
 * @param storeData - The complete store data (Website object)
 * @returns Promise with the updated data
 */
export async function updateStoreData(pageId: number, storeData: Website): Promise<Website> {
  try {
    const response = await fetch('/api/pages', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pageId, storeData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating store data:', error);
    throw error;
  }
}

/**
 * Create new store data via API
 * @param storeData - The complete store data (Website object)
 * @returns Promise with the created data and ID
 */
export async function createStoreData(storeData: Website): Promise<{ data: Website; id: number }> {
  try {
    const response = await fetch('/api/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ storeData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating store data:', error);
    throw error;
  }
}

/**
 * Upsert store data via API (create or update)
 * @param pageId - The page ID (bigint) in the database (optional for insert)
 * @param storeData - The complete store data (Website object)
 * @returns Promise with the updated/inserted data
 */
export async function upsertStoreData(
  pageId: number | null,
  storeData: Website
): Promise<{ data: Website; id: number }> {
  try {
    const response = await fetch('/api/pages/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pageId, storeData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error upserting store data:', error);
    throw error;
  }
}
