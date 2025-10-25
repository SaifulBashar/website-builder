import React from 'react';
import { GalleryBlock } from '@/types/blocks';
import { Carousel } from 'antd';

const GalleryRenderer: React.FC<{ block: GalleryBlock }> = ({ block }) => {
  return (
    <Carousel dots arrows className="w-full">
      {block.images.map((img) => (
        <div key={img.id} className="flex flex-col items-center justify-center">
          <img src={img.url} alt={img.alt ?? ''} className="w-full h-80 object-cover rounded-md" />
        </div>
      ))}
    </Carousel>
  );
};

export default GalleryRenderer;
