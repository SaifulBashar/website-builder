export type BlockType = 'text' | 'video' | 'gallery' | 'split-view';

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // HTML from Quill editor
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string;
  thumbnail?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  styles?: {
    width?: string;
    height?: string;
    aspectRatio?: string;
  };
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: {
    id: string;
    url: string;
    alt?: string;
    caption?: string;
  }[];
  layout?: 'grid' | 'carousel';
  columns?: number;
  gap?: string;
}

export interface SplitViewBlock extends BaseBlock {
  type: 'split-view';
  leftContent: {
    type: 'image' | 'text';
    content: string;
  };
  rightContent: {
    type: 'text' | 'image';
    content: string;
  };
  ratio?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
  verticalAlign?: 'top' | 'center' | 'bottom';
}

export type Block = TextBlock | VideoBlock | GalleryBlock | SplitViewBlock;

export interface Page {
  id: string;
  name: string;
  slug: string;
  blocks: Block[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  settings?: {
    backgroundColor?: string;
    maxWidth?: string;
  };
}

export interface Website {
  id: string;
  name: string;
  pages: Page[];
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
}
