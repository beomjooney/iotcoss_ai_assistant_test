import React, { memo } from 'react';
import * as R from 'ramda';
import { Handle, Position } from 'react-flow-renderer';
import Node, { contentStyle as style } from './Node';

const isValidInput = connection => {
  return R.last(R.split('__', connection.source)) === 'value';
};
const isValidOutput = connection => {
  return R.last(R.split('__', connection.target)) === 'value';
};

const ValueNode = ({ data, selected }) => {
  return (
    <Node
      level={data.level}
      group={data.group}
      label={data.name}
      color={'#E0FFE0'}
      selected={selected}
      content={
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <div style={{ ...style.io }}>
          {'= ' + data.value}
          <Handle
            type="target"
            position={Position.Left}
            id="i__value"
            style={{ ...style.handle, ...style.left }}
            isValidConnection={isValidInput}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="o__value"
            style={{ ...style.handle, ...style.right }}
            isValidConnection={isValidOutput}
          />
        </div>
      }
    />
  );
};

export default memo(ValueNode);
