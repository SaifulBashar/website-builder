import React from 'react';
import { SplitViewBlock } from '@/types/blocks';

const SplitViewRenderer: React.FC<{ block: SplitViewBlock }> = ({ block }) => {
  const ratio = block.ratio ?? '50-50';
  const [left, right] = ratio.split('-').map((v) => Number(v));
  const align = block.verticalAlign ?? 'top';
  const alignClass =
    align === 'center' ? 'items-center' : align === 'bottom' ? 'items-end' : 'items-start';

  const renderInner = (slot: SplitViewBlock['leftContent']) => {
    const type = slot.type as 'image' | 'text';
    if (type === 'text') return <div dangerouslySetInnerHTML={{ __html: slot.content }} />;
    if (type === 'image')
      return <img src={slot.content} alt="" className="w-full h-auto object-cover" />;
    return null;
  };

  return (
    <div
      className={`w-full grid gap-6 ${alignClass}`}
      style={{ gridTemplateColumns: `${left}fr ${right}fr` }}
    >
      <div>{renderInner(block.leftContent)}</div>
      <div>{renderInner(block.rightContent)}</div>
    </div>
  );
};

export default SplitViewRenderer;
