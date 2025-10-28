import React from 'react';
import { GalleryBlock } from '@/types/blocks';
import { Carousel, Button } from 'antd';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  block: GalleryBlock;
  onRemove?: () => void;
  onEdit?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isPreview?: boolean;
}

const GalleryRenderer: React.FC<Props> = ({
  block,
  onRemove,
  onEdit,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  isPreview = false,
}) => {
  return (
    <div>
      <Carousel dots arrows className="w-full">
        {block.images.map((img) => (
          <div key={img.id} className="flex flex-col items-center justify-center">
            <img
              src={img.url}
              alt={img.alt ?? ''}
              className="w-full h-80 object-cover rounded-md"
            />
          </div>
        ))}
      </Carousel>
      {!isPreview && onRemove && onEdit && (
        <div className="p-4 flex items-center justify-center gap-4">
          {onMoveUp && (
            <Button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              icon={<ChevronUp size={16} />}
              title="Move Up"
            />
          )}
          {onMoveDown && (
            <Button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              icon={<ChevronDown size={16} />}
              title="Move Down"
            />
          )}
          <Button onClick={onRemove}>Remove</Button>
          <Button onClick={onEdit}>Edit</Button>
        </div>
      )}
    </div>
  );
};

export default GalleryRenderer;
