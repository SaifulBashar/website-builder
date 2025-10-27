import { create } from 'zustand';
import { Block, Page, Website } from '@/types/blocks';

interface WebsiteStore {
  website: Website | null;
  currentPage: Page | null;
  currentPageId: string;

  // Actions
  setWebsite: (website: Website) => void;
  setCurrentPage: (pageId: string) => void;
  addPage: (page: Omit<Page, 'id'>) => void;
  updatePage: (pageId: string, updates: Partial<Omit<Page, 'id'>>) => void;
  deletePage: (pageId: string) => void;
  addBlock: (pageId: string, block: Block) => void;
  updateBlock: (pageId: string, blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
  reorderBlocks: (pageId: string, blocks: Block[]) => void;
}

export const useWebsiteStore = create<WebsiteStore>((set) => ({
  website: {
    name: 'My Website',
    pages: [
      {
        id: 'home',
        name: 'Home',
        slug: 'home_slug',
        blocks: [],
        settings: {
          backgroundColor: '#ffffff',
          maxWidth: '1100px',
        },
      },
    ],
    id: 'website_1',
  },
  currentPage: {
    name: 'home',
    blocks: [],
    id: 'home',
    slug: 'home_slug',
  },
  currentPageId: 'home',

  setWebsite: (website) => set({ website }),

  setCurrentPage: (pageId) =>
    set((state) => ({
      currentPage: state.website?.pages.find((p) => p.id === pageId) || null,
      currentPageId: pageId,
    })),

  addPage: (page) =>
    set((state) => {
      if (!state.website) return state;
      const newPageId = `page_${Date.now()}`;
      const newPage: Page = {
        ...page,
        id: newPageId,
      };
      return {
        ...state,
        website: {
          ...state.website,
          pages: [...state.website.pages, newPage],
        },
      };
    }),

  updatePage: (pageId, updates) =>
    set((state) => {
      if (!state.website) return state;
      return {
        ...state,
        website: {
          ...state.website,
          pages: state.website.pages.map((page) =>
            page.id === pageId ? { ...page, ...updates } : page
          ),
        },
        currentPage:
          state.currentPageId === pageId
            ? { ...state.currentPage!, ...updates }
            : state.currentPage,
      };
    }),

  addBlock: (pageId, block) => {
    console.log('here', {
      pageId,
      block,
    });
    set((state) => {
      if (!state.website) return state;
      return {
        ...state,
        website: {
          ...state.website,
          pages: state.website.pages.map((page) =>
            page.id === pageId ? { ...page, blocks: [...page.blocks, block] } : page
          ),
        },
      };
    });
  },

  updateBlock: (pageId, blockId, updates) =>
    set((state) => {
      if (!state.website) return state;
      return {
        ...state,
        website: {
          ...state.website,
          pages: state.website.pages.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  blocks: page.blocks.map((block) =>
                    block.id === blockId ? ({ ...block, ...updates } as Block) : block
                  ),
                }
              : page
          ),
        },
      };
    }),

  deletePage: (pageId) =>
    set((state) => {
      if (!state.website) return state;
      const updatedPages = state.website.pages.filter((page) => page.id !== pageId);
      // If deleting the current page, switch to home
      const newCurrentPageId = state.currentPageId === pageId ? 'home' : state.currentPageId;
      return {
        ...state,
        website: {
          ...state.website,
          pages: updatedPages,
        },
        currentPageId: newCurrentPageId,
        currentPage: updatedPages.find((p) => p.id === newCurrentPageId) || null,
      };
    }),

  deleteBlock: (pageId, blockId) =>
    set((state) => {
      if (!state.website) return state;
      return {
        ...state,
        website: {
          ...state.website,
          pages: state.website.pages.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  blocks: page.blocks.filter((block) => block.id !== blockId),
                }
              : page
          ),
        },
      };
    }),

  reorderBlocks: (pageId, blocks) =>
    set((state) => {
      if (!state.website) return state;
      return {
        ...state,
        website: {
          ...state.website,
          pages: state.website.pages.map((page) =>
            page.id === pageId ? { ...page, blocks } : page
          ),
        },
      };
    }),
}));
