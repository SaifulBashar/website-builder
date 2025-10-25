import React from 'react';
import { TextBlock } from '@/types/blocks';
import { Button } from 'antd';

interface Props {
  block: TextBlock;
  onRemove: () => void;
  onEdit: () => void;
}

const TextRenderer: React.FC<Props> = ({ block, onRemove, onEdit }) => (
  <div>
    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.content || '' }} />
    <div className="p-4 flex items-center justify-center gap-4">
      <Button onClick={onRemove}>Remove</Button>
      <Button onClick={onEdit}>Edit</Button>
    </div>
  </div>
);

export default TextRenderer;
