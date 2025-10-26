import React from 'react';
import { VideoBlock } from '@/types/blocks';
import { Button } from 'antd';

interface Props {
  block: VideoBlock;
  onRemove?: () => void;
  onEdit?: () => void;
  isPreview?: boolean;
}

const VideoRenderer: React.FC<Props> = ({ block, onRemove, onEdit, isPreview = false }) => (
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
        <Button onClick={onRemove}>Remove</Button>
        <Button onClick={onEdit}>Edit</Button>
      </div>
    )}
  </div>
);

export default VideoRenderer;
