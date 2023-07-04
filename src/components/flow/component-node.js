import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';

const ComponentNode = ({ data, isConnectable }) => {
  const Component = data.component;
  return (
    <>
      <div className="react-flow__label">{data.label}</div>
      <Handle id="input" type="target" position={Position.Top} isConnectable={isConnectable} />
      <Component />
      <Handle id="yes" type="source" position={Position.Right} isConnectable={isConnectable} />
      <Handle id="no" type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </>
  );
};

ComponentNode.displayName = 'ComponentNode';

export default memo(ComponentNode);
