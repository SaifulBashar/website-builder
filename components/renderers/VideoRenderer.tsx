import React from 'react';
import { VideoBlock } from '@/types/blocks';
import { Button } from 'antd';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  block: VideoBlock;
  onRemove?: () => void;
  onEdit?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isPreview?: boolean;
}

const VideoRenderer: React.FC<Props> = ({
  block,
  onRemove,
  onEdit,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  isPreview = false,
}) => (
  <div>
    <div className="w-full bg-black">
      <video
        src={block.url}
        controls
        className="mx-auto"
        autoPlay={block.autoplay}
        loop={block.loop}
        muted={block.muted}
        style={{
          width: block.styles?.width,
          height: block.styles?.height,
        }}
      />
    </div>
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

export default VideoRenderer;
