import { create } from 'zustand';
import { Block, Page, Website } from '@/types/blocks';

interface WebsiteStore {
  website: Website | null;
  currentPage: Page | null;

  // Actions
  setWebsite: (website: Website) => void;
  setCurrentPage: (pageId: string) => void;
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
        blocks: [
          {
            id: 'video_1',
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1200&q=80',
            autoplay: false,
            loop: false,
            muted: false,
            styles: {
              width: '100%',
              height: '480px',
              aspectRatio: '16/9',
            },
            order: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'split_1',
            type: 'split-view' as const,
            leftContent: {
              type: 'image',
              content: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80',
            },
            rightContent: {
              type: 'text',
              content: `<h2>Explore the Mountains</h2><p>Stunning views and fresh air. Use this area for a short description or call to action.</p>`,
            },
            ratio: '30-70',
            verticalAlign: 'center',
            order: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'gallery_1',
            type: 'gallery' as const,
            images: [
              {
                id: 'img1',
                url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
                alt: 'Mountain Lake',
                caption: 'A beautiful mountain lake',
              },
              {
                id: 'img2',
                url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
                alt: 'Forest Path',
                caption: 'A path through the forest',
              },
              {
                id: 'img3',
                url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
                alt: 'Desert Dunes',
                caption: 'Desert dunes at sunset',
              },
            ],

            order: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
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

  setWebsite: (website) => set({ website }),

  setCurrentPage: (pageId) =>
    set((state) => ({
      currentPage: state.website?.pages.find((p) => p.id === pageId) || null,
    })),

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
