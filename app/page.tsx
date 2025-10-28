'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';

import Preview from '@/components/Preview';
import { useStoreData } from '@/hooks/useStoreData';
import { Spin } from 'antd';

const AddBlocks = dynamic(
  () => import('@/components/AddBlocks').then((mod) => ({ default: mod.AddBlocks })),
  {
    ssr: false,
  }
);
const RenderWebPage = dynamic(
  () => import('@/components/RenderWebPage').then((mod) => ({ default: mod.RenderWebPage })),
  {
    ssr: false,
  }
);

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const { fetchData, isLoading, error, databaseId } = useStoreData();

  // Fetch data on component mount if we have a database ID
  useEffect(() => {
    if (databaseId) {
      fetchData(databaseId);
    }
  }, [databaseId, fetchData]);

  // Function to manually fetch data with a specific page ID
  const handleFetchData = async (pageId: number) => {
    await fetchData(pageId);
  };

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <main className="flex-1 ml-64 overflow-y-auto relative">
        <Spin spinning={isLoading} fullscreen />

        {/* Error state */}
        {error && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded z-50">
            Error: {error}
          </div>
        )}

        <RenderWebPage />
        <Preview />
        <AddBlocks />
      </main>
    </div>
  );
}
