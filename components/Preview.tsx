import React, { useState } from 'react';
import { useWebsiteStore } from '@/store';
import type { Block, Page } from '@/types/blocks';
import { Modal, Button, Segmented } from 'antd';
import { DesktopOutlined, MobileOutlined, EyeOutlined } from '@ant-design/icons';
import TextRenderer from './renderers/TextRenderer';
import VideoRenderer from './renderers/VideoRenderer';
import GalleryRenderer from './renderers/GalleryRenderer';
import SplitViewRenderer from './renderers/SplitViewRenderer';
import { Header } from './renderers/Header';

type ViewMode = 'desktop' | 'mobile';

const Preview: React.FC = () => {
  const { website, currentPageId } = useWebsiteStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');

  const page: Page | null = website?.pages.find((p) => p.id === currentPageId) || null;

  if (!page) {
    return null;
  }

  const bg = page.settings?.backgroundColor ?? '#ffffff';
  const maxW = page.settings?.maxWidth ?? '1100px';
  const blocks = [...(page.blocks || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'text':
        return <TextRenderer block={block} isPreview={true} />;
      case 'video':
        return <VideoRenderer block={block} isPreview={true} />;
      case 'gallery':
        return <GalleryRenderer block={block} isPreview={true} />;
      case 'split-view':
        return <SplitViewRenderer block={block} isPreview={true} />;
      default:
        return null;
    }
  };

  const PreviewContent = () => (
    <div className="w-full min-h-screen overflow-auto" style={{ backgroundColor: bg }}>
      <div
        className="mx-auto px-4 py-8"
        style={{
          maxWidth: viewMode === 'mobile' ? '375px' : maxW,
          transition: 'max-width 0.3s ease',
        }}
      >
        <Header />
        <br />
        {blocks.length === 0 ? (
          <div className="text-gray-500 text-center">This page has no blocks yet.</div>
        ) : (
          <div className="flex flex-col gap-8">
            {blocks.map((block) => (
              <section key={block.id}>{renderBlock(block)}</section>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        className="bg-black rounded-full p-4 text-white fixed bottom-36  shadow-lg transition-transform hover:scale-105 right-10 hover:bg-slate-800 inline-flex items-center gap-2 "
        onClick={() => setIsModalOpen(true)}
      >
        <EyeOutlined />
      </button>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="100%"
        style={{ top: 0, maxWidth: '100vw', padding: 0 }}
        styles={{
          body: { height: '100vh', padding: 0 },
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header with view mode toggle */}
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <h3 className="text-lg font-semibold m-0">Preview</h3>
            <Segmented
              value={viewMode}
              onChange={(value) => setViewMode(value as ViewMode)}
              options={[
                {
                  label: 'Desktop',
                  value: 'desktop',
                  icon: <DesktopOutlined />,
                },
                {
                  label: 'Mobile',
                  value: 'mobile',
                  icon: <MobileOutlined />,
                },
              ]}
            />
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </div>

          {/* Preview content */}
          <div className="flex-1 overflow-auto bg-gray-100">
            <PreviewContent />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Preview;
