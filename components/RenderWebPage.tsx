import React, { useState } from 'react';
import { useWebsiteStore } from '@/store';
import type { Block, Page, SplitViewBlock, GalleryBlock, VideoBlock } from '@/types/blocks';
import { Modal } from 'antd';
import Editor from './Editor';
import TextRenderer from './renderers/TextRenderer';
import VideoRenderer from './renderers/VideoRenderer';
import GalleryRenderer from './renderers/GalleryRenderer';
import SplitViewRenderer from './renderers/SplitViewRenderer';
import SplitViewModal from './SplitViewModal';
import GalleryEditModal from './GalleryEditModal';
import VideoEditModal from './VideoEditModal';
import { Header } from './renderers/Header';

export const RenderWebPage = () => {
  const { website, currentPageId } = useWebsiteStore();
  const deleteBlock = useWebsiteStore((state) => state.deleteBlock);
  const updateBlock = useWebsiteStore((state) => state.updateBlock);

  // Editor modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Split-view editor modal state
  const [splitEditOpen, setSplitEditOpen] = useState(false);
  const [editingSplitBlock, setEditingSplitBlock] = useState<SplitViewBlock | null>(null);

  // Gallery editor modal state
  const [galleryEditOpen, setGalleryEditOpen] = useState(false);
  const [editingGalleryBlock, setEditingGalleryBlock] = useState<GalleryBlock | null>(null);

  // Video editor modal state
  const [videoEditOpen, setVideoEditOpen] = useState(false);
  const [editingVideoBlock, setEditingVideoBlock] = useState<VideoBlock | null>(null);

  const page: Page | null = website?.pages.find((p) => p.id === currentPageId) || null;

  if (!page) {
    return <div className="text-gray-500 p-6">No page selected.</div>;
  }

  const bg = page.settings?.backgroundColor ?? 'transparent';
  const maxW = page.settings?.maxWidth ?? '960px';

  const blocks = [...(page.blocks || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
        return (
          <VideoRenderer
            block={block}
            onRemove={() => deleteBlock(page.id, block.id)}
            onEdit={() => {
              setEditingVideoBlock(block);
              setVideoEditOpen(true);
            }}
          />
        );

      case 'gallery':
        return (
          <GalleryRenderer
            block={block}
            onRemove={() => deleteBlock(page.id, block.id)}
            onEdit={() => {
              setEditingGalleryBlock(block);
              setGalleryEditOpen(true);
            }}
          />
        );
      case 'split-view':
        return (
          <SplitViewRenderer
            block={block}
            onRemove={() => deleteBlock(page.id, block.id)}
            onEdit={() => {
              setEditingSplitBlock(block);
              setSplitEditOpen(true);
            }}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: bg }}>
      <div className="mx-auto px-4 py-8" style={{ maxWidth: maxW }}>
        <Header />
        <br />
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
        width={800}
      >
        <Editor defaultValue={editContent} onChange={setEditContent} />
      </Modal>

      <SplitViewModal
        open={splitEditOpen}
        title="Edit Split-View Block"
        editingBlock={editingSplitBlock}
        onOk={(values) => {
          if (!page || !editingSplitBlock) return;

          updateBlock(page.id, editingSplitBlock.id, {
            leftContent: values.leftContent,
            rightContent: values.rightContent,
            ratio: values.ratio,
            verticalAlign: values.verticalAlign,
            updatedAt: new Date().toISOString(),
          });
          setSplitEditOpen(false);
          setEditingSplitBlock(null);
        }}
        onCancel={() => {
          setSplitEditOpen(false);
          setEditingSplitBlock(null);
        }}
      />

      <GalleryEditModal
        open={galleryEditOpen}
        title="Edit Gallery Block"
        editingBlock={editingGalleryBlock}
        onOk={(values) => {
          if (!page || !editingGalleryBlock) return;

          updateBlock(page.id, editingGalleryBlock.id, {
            images: values.images,
            updatedAt: new Date().toISOString(),
          });
          setGalleryEditOpen(false);
          setEditingGalleryBlock(null);
        }}
        onCancel={() => {
          setGalleryEditOpen(false);
          setEditingGalleryBlock(null);
        }}
      />

      <VideoEditModal
        open={videoEditOpen}
        title="Edit Video Block"
        editingBlock={editingVideoBlock}
        onOk={(values) => {
          if (!page || !editingVideoBlock) return;

          updateBlock(page.id, editingVideoBlock.id, {
            url: values.url,
            autoplay: values.autoplay || false,
            loop: values.loop || false,
            muted: values.muted || false,
            styles: {
              ...editingVideoBlock.styles,
              width: values.width || editingVideoBlock.styles?.width,
              height: values.height || editingVideoBlock.styles?.height,
            },
            updatedAt: new Date().toISOString(),
          });
          setVideoEditOpen(false);
          setEditingVideoBlock(null);
        }}
        onCancel={() => {
          setVideoEditOpen(false);
          setEditingVideoBlock(null);
        }}
      />
    </div>
  );
};
