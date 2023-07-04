import React, { memo } from 'react';
import * as R from 'ramda';
import { Handle, Position } from 'react-flow-renderer';
import Node, { contentStyle as style } from './Node';

const isValidInput = connection => {
  return R.last(R.split('__', connection.source)) === 'data';
};
const isValidOutput = connection => {
  return R.last(R.split('__', connection.target)) === 'data';
};

const DataNode = ({ data, selected }) => {
  return (
    <Node
      level={data.level}
      group={data.group}
      label={data.name}
      selected={selected}
      color={'LightCyan'}
      content={
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <div style={style.io}>
          {!data.uploaded && (
            <Handle
              type="target"
              position={Position.Left}
              id="i__data"
              style={{ ...style.handle, ...style.left }}
              isValidConnection={isValidInput}
            />
          )}
          {'Data'}
          <Handle
            type="source"
            position={Position.Right}
            id="o__data"
            style={{ ...style.handle, ...style.right }}
            isValidConnection={isValidOutput}
          />
        </div>
      }
    />
  );
};

export default memo(DataNode);
