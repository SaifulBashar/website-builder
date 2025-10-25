'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { AddBlocks } from '@/components/AddBlocks';
import { RenderWebPage } from '@/components/RenderWebPage';

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <main className="flex-1 ml-64 overflow-y-auto relative ">
        <RenderWebPage />
        <AddBlocks />
      </main>
    </div>
  );
}
