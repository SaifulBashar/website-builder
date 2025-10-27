import { useWebsiteStore } from '@/store';
import { Globe, Link, PanelLeft } from 'lucide-react';
import React from 'react';

export const Header = () => {
  const { website, setCurrentPage } = useWebsiteStore();
  return (
    <div className="flex items-center px-3 shadow bg-gray-800 rounded-lg text-white h-12">
      <div className="flex-1">
        <p>Saiful</p>
      </div>
      <div className="flex gap-4">
        {website?.pages.map((page) => (
          <span
            onClick={() => setCurrentPage(page.id)}
            key={page.id}
            className="flex items-center gap-1 underline"
          >
            <Globe size={14} />
            &nbsp;
            {page.name}
          </span>
        ))}
      </div>
    </div>
  );
};
