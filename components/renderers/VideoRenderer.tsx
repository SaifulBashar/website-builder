import React from 'react';
import { VideoBlock } from '@/types/blocks';

const VideoRenderer: React.FC<{ block: VideoBlock }> = ({ block }) => (
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
);

export default VideoRenderer;
