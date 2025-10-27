'use client';

import { useWebsiteStore } from '@/store';
import { useState } from 'react';
import { Page } from '@/types/blocks';
import {
  LayoutGrid,
  Plus,
  ChevronUp,
  GripVertical,
  Home,
  MoreHorizontal,
  Trash,
  Edit2,
} from 'lucide-react';
import { Modal, Input, Button, Popconfirm, Popover } from 'antd';

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const { website, currentPageId, setCurrentPage, addPage, updatePage, deletePage } =
    useWebsiteStore();
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);

  const handleAddPage = () => {
    if (newPageName.trim()) {
      const slug = newPageName.toLowerCase().replace(/\s+/g, '-');
      addPage({
        name: newPageName,
        slug,
        blocks: [],
        settings: {
          backgroundColor: '#ffffff',
          maxWidth: '1100px',
        },
      });
      setNewPageName('');
      setIsAddingPage(false);
    }
  };

  const handleModalOk = () => {
    handleAddPage();
  };

  const handleModalCancel = () => {
    setIsAddingPage(false);
    setNewPageName('');
  };

  const handleDeletePage = (pageId: string) => {
    deletePage(pageId);
    setDeletingPageId(null);
  };

  const handleRenamePage = (pageId: string) => {
    if (renameValue.trim()) {
      const slug = renameValue.toLowerCase().replace(/\s+/g, '-');
      updatePage(pageId, {
        name: renameValue,
        slug,
      });
      setRenamingPageId(null);
      setRenameValue('');
    }
  };

  const openRenamePopover = (pageId: string, currentName: string) => {
    setRenamingPageId(pageId);
    setRenameValue(currentName);
  };

  return (
    <aside className="w-[230px] bg-[#1a1a1a] h-screen fixed left-0 top-0 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <LayoutGrid size={20} />

          <h2 className="text-base font-medium">Pages</h2>
          <Button type="text" onClick={() => setIsAddingPage(true)}>
            <Plus size={20} color="white" />
          </Button>
        </div>
      </div>

      {/* Pages List */}
      <div className="p-3 space-y-1">
        {website?.pages.map((page, index) => (
          <div
            key={page.id}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
              currentPageId === page.id ? 'bg-gray-800' : 'hover:bg-gray-800/50'
            }`}
            onClick={() => setCurrentPage(page.id)}
          >
            {/* Page Icon */}
            <div className="flex items-center justify-center w-5">
              {index === 0 ? (
                <Home size={16} />
              ) : (
                <LayoutGrid size={16} className="text-gray-400" />
              )}
            </div>

            {/* Page Name */}
            <span className="flex-1 text-sm">{page.name}</span>

            {/* Options Menu */}
            {index !== 0 && (
              <div className="flex items-center gap-1">
                {/* Rename Button */}
                <Popover
                  content={
                    <div className="w-64">
                      <Input
                        placeholder="Enter new page name"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onPressEnter={() => handleRenamePage(page.id)}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          size="small"
                          onClick={() => {
                            setRenamingPageId(null);
                            setRenameValue('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => handleRenamePage(page.id)}
                          disabled={!renameValue.trim()}
                        >
                          Rename
                        </Button>
                      </div>
                    </div>
                  }
                  title="Rename Page"
                  trigger="click"
                  open={renamingPageId === page.id}
                  onOpenChange={(visible) => {
                    if (visible) {
                      openRenamePopover(page.id, page.name);
                    } else {
                      setRenamingPageId(null);
                      setRenameValue('');
                    }
                  }}
                >
                  <Button
                    type="text"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    icon={<Edit2 size={16} color="white" />}
                  />
                </Popover>

                {/* Delete Button */}
                <Popconfirm
                  title="Delete Page"
                  description={`Are you sure you want to delete "${page.name}"?`}
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    handleDeletePage(page.id);
                  }}
                  onCancel={(e) => e?.stopPropagation()}
                  okText="Delete"
                  cancelText="Cancel"
                  okType="danger"
                >
                  <Button
                    type="text"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    icon={<Trash size={16} color="white" />}
                  />
                </Popconfirm>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Page Modal */}
      <Modal
        title="Add New Page"
        open={isAddingPage}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Add Page"
        cancelText="Cancel"
        okButtonProps={{ disabled: !newPageName.trim() }}
      >
        <div className="py-4">
          <label className="block text-sm font-medium mb-2">Page Name</label>
          <Input
            placeholder="Enter page name"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onPressEnter={handleModalOk}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            Slug: {newPageName.toLowerCase().replace(/\s+/g, '-') || 'page-slug'}
          </p>
        </div>
      </Modal>
    </aside>
  );
}
