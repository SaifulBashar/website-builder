import { Popover, Button, Modal, Upload, message } from 'antd';
import { GalleryThumbnails, Plus, SplitIcon, Text, Video } from 'lucide-react';
import React, { useState } from 'react';
import Editor from './Editor';
import { TextBlock, SplitViewBlock, GalleryBlock, VideoBlock } from '@/types/blocks';
import { useWebsiteStore } from '@/store';
import SplitViewModal from './SplitViewModal';
import GalleryEditModal from './GalleryEditModal';
import VideoEditModal from './VideoEditModal';

const DESIGN = [
  {
    text: 'Video',
    icon: <Video />,
  },
  {
    text: 'Text',
    icon: <Text />,
  },
  {
    text: 'Gallery',
    icon: <GalleryThumbnails />,
  },
  {
    text: 'Split view',
    icon: <SplitIcon />,
  },
];

export const AddBlocks = () => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isSplitViewModalOpen, setIsSplitViewModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  // Gallery modal state is now managed in GalleryBlockModal
  const { currentPage, addBlock } = useWebsiteStore();

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleTextClick = () => {
    setIsModalOpen(true);
    hide();
  };

  const handleGalleryClick = () => {
    setIsGalleryModalOpen(true);
    hide();
  };

  const handleSplitViewClick = () => {
    setIsSplitViewModalOpen(true);
    hide();
  };

  const handleVideoClick = () => {
    setIsVideoModalOpen(true);
    hide();
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    console.log('Editor content:', editorContent);
    const newBlock: TextBlock = {
      id: crypto.randomUUID(),
      type: 'text',
      content: editorContent,
      order: currentPage?.blocks.length || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addBlock(currentPage!.id, newBlock);
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Popover
        content={
          <div>
            <p>Design</p>
            <div className="grid grid-cols-4 gap-4">
              {DESIGN.map((design) => (
                <button
                  key={design.text}
                  onClick={
                    design.text === 'Text'
                      ? handleTextClick
                      : design.text === 'Gallery'
                        ? handleGalleryClick
                        : design.text === 'Split view'
                          ? handleSplitViewClick
                          : design.text === 'Video'
                            ? handleVideoClick
                            : hide
                  }
                  className="flex flex-col items-center gap-2 hover:bg-gray-200 p-4 rounded-lg transition-colors border-none"
                >
                  {design.icon}
                  {design.text}
                </button>
              ))}
            </div>
          </div>
        }
        title={null}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <button className="bg-black rounded-full p-4 text-white fixed bottom-20  shadow-lg transition-transform hover:scale-105 right-10 hover:bg-slate-800 inline-flex items-center gap-2 ">
          <Plus size={14} />
          Add Block
        </button>
      </Popover>

      {/* Text Block Modal */}
      <Modal
        title="Add Text Block"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="Add"
        cancelText="Cancel"
      >
        <Editor onChange={(content) => setEditorContent(content)} />
      </Modal>

      {/* Gallery Block Modal */}
      <GalleryEditModal
        open={isGalleryModalOpen}
        title="Add Gallery Block"
        onOk={({ images }) => {
          if (!currentPage) return;
          const newBlock: GalleryBlock = {
            id: crypto.randomUUID(),
            type: 'gallery',
            images,
            order: currentPage.blocks.length || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          addBlock(currentPage.id, newBlock);
          setIsGalleryModalOpen(false);
        }}
        onCancel={() => setIsGalleryModalOpen(false)}
      />

      {/* Split-View Block Modal */}
      <SplitViewModal
        open={isSplitViewModalOpen}
        title="Add Split-View Block"
        onOk={(values) => {
          if (!currentPage) return;
          const newBlock: SplitViewBlock = {
            id: crypto.randomUUID(),
            type: 'split-view',
            leftContent: values.leftContent,
            rightContent: values.rightContent,
            ratio: values.ratio,
            verticalAlign: values.verticalAlign,
            order: currentPage.blocks.length || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          addBlock(currentPage.id, newBlock);
          setIsSplitViewModalOpen(false);
        }}
        onCancel={() => setIsSplitViewModalOpen(false)}
      />

      {/* Video Block Modal */}
      <VideoEditModal
        open={isVideoModalOpen}
        title="Add Video Block"
        editingBlock={null}
        onOk={(values) => {
          if (!currentPage) return;
          const newBlock: VideoBlock = {
            id: crypto.randomUUID(),
            type: 'video',
            url: values.url,
            autoplay: values.autoplay,
            loop: values.loop,
            muted: values.muted,
            styles: {
              width: values.width,
              height: values.height,
            },
            order: currentPage.blocks.length || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          addBlock(currentPage.id, newBlock);
          setIsVideoModalOpen(false);
        }}
        onCancel={() => setIsVideoModalOpen(false)}
      />
    </>
  );
};
