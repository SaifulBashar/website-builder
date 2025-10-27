import React, { useState } from 'react';
import { useStoreData } from '@/hooks/useStoreData';

/**
 * Component for testing and demonstrating store data fetching
 */
export function StoreDataManager() {
  const [inputPageId, setInputPageId] = useState<string>('1');
  const { fetchData, setPageId, isLoading, error, databaseId, website } = useStoreData();

  const handleFetchData = async () => {
    const pageId = parseInt(inputPageId);
    if (isNaN(pageId)) {
      alert('Please enter a valid page ID');
      return;
    }

    const success = await fetchData(pageId);
    if (success) {
      console.log('Data fetched successfully');
    }
  };

  const handleSetPageId = async () => {
    const pageId = parseInt(inputPageId);
    if (isNaN(pageId)) {
      alert('Please enter a valid page ID');
      return;
    }

    const success = await setPageId(pageId, true); // Auto-fetch enabled
    if (success) {
      console.log('Page ID set and data fetched successfully');
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Store Data Manager</h3>

      {/* Input section */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={inputPageId}
          onChange={(e) => setInputPageId(e.target.value)}
          placeholder="Enter page ID"
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleFetchData}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Fetch Data
        </button>
        <button
          onClick={handleSetPageId}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Set Page ID & Fetch
        </button>
      </div>

      {/* Status section */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Current Database ID: <span className="font-mono">{databaseId || 'None'}</span>
        </p>
        {isLoading && <p className="text-blue-600 text-sm mt-1">🔄 Loading...</p>}
        {error && <p className="text-red-600 text-sm mt-1">❌ Error: {error}</p>}
      </div>

      {/* Website data preview */}
      {website && (
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-medium mb-2">Website Data:</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>Name:</strong> {website.name}
            </p>
            <p>
              <strong>ID:</strong> {website.id}
            </p>
            <p>
              <strong>Pages:</strong> {website.pages.length}
            </p>
            <div className="mt-2">
              <strong>Pages:</strong>
              <ul className="ml-4 mt-1">
                {website.pages.map((page) => (
                  <li key={page.id} className="text-xs">
                    {page.name} ({page.blocks.length} blocks)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
