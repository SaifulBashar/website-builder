import { create } from 'zustand';
import { Block, Page, Website } from '@/types/blocks';
import { getStoreData, updateStoreData, upsertStoreData } from '@/lib/api-client';

interface WebsiteStore {
  website: Website | null;
  currentPage: Page | null;
  currentPageId: string;
  databaseId: number | null; // Track the database record ID
  isLoading: boolean;
  error: string | null;

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
  moveBlockUp: (pageId: string, blockId: string) => void;
  moveBlockDown: (pageId: string, blockId: string) => void;
  fetchAndUpdateStore: (pageId: number) => Promise<void>;
  setDatabaseId: (id: number | null) => void;
}

export const useWebsiteStore = create<WebsiteStore>((set, get) => ({
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
  databaseId: 1,
  isLoading: false,
  error: null,

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

      const updatedWebsite = {
        ...state.website,
        pages: [...state.website.pages, newPage],
      };

      // Silently upsert data to the backend
      if (state.databaseId !== null) {
        upsertStoreData(state.databaseId, updatedWebsite).catch((error) => {
          console.error('Silent upsert failed for addPage:', error);
        });
      }

      return {
        ...state,
        website: updatedWebsite,
      };
    }),

  updatePage: (pageId, updates) =>
    set((state) => {
      if (!state.website) return state;

      const updatedWebsite = {
        ...state.website,
        pages: state.website.pages.map((page) =>
          page.id === pageId ? { ...page, ...updates } : page
        ),
      };

      // Silently upsert data to the backend
      if (state.databaseId !== null) {
        upsertStoreData(state.databaseId, updatedWebsite).catch((error) => {
          console.error('Silent upsert failed for updatePage:', error);
        });
      }

      return {
        ...state,
        website: updatedWebsite,
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
      const updatedWebsite = {
        ...state.website,
        pages: state.website.pages.map((page) =>
          page.id === pageId ? { ...page, blocks: [...page.blocks, block] } : page
        ),
      };

      // Silently upsert data to the backend
      if (state.databaseId !== null) {
        upsertStoreData(state.databaseId, updatedWebsite).catch((error) => {
          console.error('Silent upsert failed for addBlock:', error);
        });
      }

      return {
        ...state,
        website: updatedWebsite,
      };
    });
  },

  updateBlock: (pageId, blockId, updates) =>
    set((state) => {
      if (!state.website) return state;
      const updatedWebsite = {
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
      };

      // Silently upsert data to the backend
      if (state.databaseId !== null) {
        upsertStoreData(state.databaseId, updatedWebsite).catch((error) => {
          console.error('Silent upsert failed for updateBlock:', error);
        });
      }

      return {
        ...state,
        website: updatedWebsite,
      };
    }),

  deletePage: (pageId) =>
    set((state) => {
      if (!state.website) return state;
      const updatedPages = state.website.pages.filter((page) => page.id !== pageId);
      // If deleting the current page, switch to home
      const newCurrentPageId = state.currentPageId === pageId ? 'home' : state.currentPageId;

      const updatedWebsite = {
        ...state.website,
        pages: updatedPages,
      };

      // Silently upsert data to the backend
      if (state.databaseId !== null) {
        upsertStoreData(state.databaseId, updatedWebsite).catch((error) => {
          console.error('Silent upsert failed for deletePage:', error);
        });
      }

      return {
        ...state,
        website: updatedWebsite,
        currentPageId: newCurrentPageId,
        currentPage: updatedPages.find((p) => p.id === newCurrentPageId) || null,
      };
    }),

  deleteBlock: (pageId, blockId) =>
    set((state) => {
      if (!state.website) return state;
      const updatedWebsite = {
        ...state.website,
        pages: state.website.pages.map((page) =>
          page.id === pageId
            ? {
                ...page,
                blocks: page.blocks.filter((block) => block.id !== blockId),
              }
            : page
        ),
      };

      // Silently upsert data to the backend
      if (state.databaseId !== null) {
        upsertStoreData(state.databaseId, updatedWebsite).catch((error) => {
          console.error('Silent upsert failed for deleteBlock:', error);
        });
      }

      return {
        ...state,
        website: updatedWebsite,
      };
    }),

  reorderBlocks: (pageId, blocks) =>
    set((state) => {
      if (!state.website) return state;
      const updatedWebsite = {
        ...state.website,
        pages: state.website.pages.map((page) => (page.id === pageId ? { ...page, blocks } : page)),
      };

      // Silently upsert data to the backend
      if (state.databaseId !== null) {
        upsertStoreData(state.databaseId, updatedWebsite).catch((error) => {
          console.error('Silent upsert failed for reorderBlocks:', error);
        });
      }

      return {
        ...state,
        website: updatedWebsite,
      };
    }),

  moveBlockUp: (pageId, blockId) =>
    set((state) => {
      if (!state.website) return state;

      const page = state.website.pages.find((p) => p.id === pageId);
      if (!page) return state;

      const sortedBlocks = [...page.blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const blockIndex = sortedBlocks.findIndex((block) => block.id === blockId);

      if (blockIndex <= 0) return state; // Already at the top or not found

      // Swap with the block above
      const newBlocks = [...sortedBlocks];
      [newBlocks[blockIndex - 1], newBlocks[blockIndex]] = [
        newBlocks[blockIndex],
        newBlocks[blockIndex - 1],
      ];

      // Update order values
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order: index,
        updatedAt: new Date().toISOString(),
      }));

      const updatedWebsite = {
        ...state.website,
        pages: state.website.pages.map((p) =>
          p.id === pageId ? { ...p, blocks: updatedBlocks } : p
        ),
      };

      // Silently upsert data to the backend
      if (state.databaseId !== null) {
        upsertStoreData(state.databaseId, updatedWebsite).catch((error) => {
          console.error('Silent upsert failed for moveBlockUp:', error);
        });
      }

      return {
        ...state,
        website: updatedWebsite,
      };
    }),

  moveBlockDown: (pageId, blockId) =>
    set((state) => {
      if (!state.website) return state;

      const page = state.website.pages.find((p) => p.id === pageId);
      if (!page) return state;

      const sortedBlocks = [...page.blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const blockIndex = sortedBlocks.findIndex((block) => block.id === blockId);

      if (blockIndex >= sortedBlocks.length - 1 || blockIndex === -1) return state; // Already at the bottom or not found

      // Swap with the block below
      const newBlocks = [...sortedBlocks];
      [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [
        newBlocks[blockIndex + 1],
        newBlocks[blockIndex],
      ];

      // Update order values
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order: index,
        updatedAt: new Date().toISOString(),
      }));

      const updatedWebsite = {
        ...state.website,
        pages: state.website.pages.map((p) =>
          p.id === pageId ? { ...p, blocks: updatedBlocks } : p
        ),
      };

      // Silently upsert data to the backend
      if (state.databaseId !== null) {
        upsertStoreData(state.databaseId, updatedWebsite).catch((error) => {
          console.error('Silent upsert failed for moveBlockDown:', error);
        });
      }

      return {
        ...state,
        website: updatedWebsite,
      };
    }),

  setDatabaseId: (id) => set({ databaseId: id }),

  fetchAndUpdateStore: async (pageId) => {
    set({ isLoading: true, error: null });

    try {
      const data = await getStoreData(pageId);

      if (data) {
        set({
          website: data,
          databaseId: pageId,
          currentPage:
            data.pages.find((p) => p.id === get().currentPageId) || data.pages[0] || null,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: 'No data found for the specified page ID',
        });
      }
    } catch (error) {
      console.error('Error fetching store data:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      });
    }
  },
}));
