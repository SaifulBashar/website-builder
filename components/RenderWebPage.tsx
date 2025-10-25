import React, { useState } from 'react';
import { useWebsiteStore } from '@/store';
import type { Block, Page } from '@/types/blocks';
import { Modal } from 'antd';
import Editor from './Editor';
import TextRenderer from './renderers/TextRenderer';
import VideoRenderer from './renderers/VideoRenderer';
import GalleryRenderer from './renderers/GalleryRenderer';
import SplitViewRenderer from './renderers/SplitViewRenderer';

export const RenderWebPage = () => {
  const { website, currentPage } = useWebsiteStore();
  const deleteBlock = useWebsiteStore((state) => state.deleteBlock);
  const updateBlock = useWebsiteStore((state) => state.updateBlock);

  // Editor modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const page: Page | null = website?.pages?.[0] || null;

  if (!page) {
    return <div className="text-gray-500 p-6">No page selected.</div>;
  }

  const bg = page.settings?.backgroundColor ?? 'transparent';
  const maxW = page.settings?.maxWidth ?? '960px';

  const blocks = [...(page.blocks || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  console.log({ website, currentPage, blocks, page });

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'text':
        return (
          <TextRenderer
            block={block}
            onRemove={() => deleteBlock(page.id, block.id)}
            onEdit={() => {
              setEditingBlockId(block.id);
              setEditContent(block.content);
              setEditOpen(true);
            }}
          />
        );
      case 'video':
        return <VideoRenderer block={block} />;

      case 'gallery':
        return <GalleryRenderer block={block} />;
      case 'split-view':
        return <SplitViewRenderer block={block} />;
      default:
        return null;
    }
  };
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: bg }}>
      <div className="mx-auto px-4 py-8" style={{ maxWidth: maxW }}>
        {blocks.length === 0 ? (
          <div className="text-gray-500">This page has no blocks yet.</div>
        ) : (
          <div className="flex flex-col gap-8">
            {blocks.map((block) => (
              <section key={block.id}>{renderBlock(block)}</section>
            ))}
          </div>
        )}
      </div>

      <Modal
        title="Edit Text Block"
        open={editOpen}
        onOk={() => {
          if (!page || !editingBlockId) return;
          updateBlock(page.id, editingBlockId, {
            content: editContent,
            updatedAt: new Date().toISOString(),
          });
          setEditOpen(false);
          setEditingBlockId(null);
        }}
        onCancel={() => setEditOpen(false)}
        destroyOnClose
        width={800}
      >
        <Editor defaultValue={editContent} onChange={setEditContent} />
      </Modal>
    </div>
  );
};
