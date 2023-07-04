import React, { memo } from 'react';
import * as R from 'ramda';
import { Handle, Position } from 'react-flow-renderer';
import Node, { contentStyle as style } from './Node';

const isValidInput = (connection, type) => {
  return R.last(R.split('__', connection.source)) === type;
};
const isValidOutput = (connection, type) => {
  return R.last(R.split('__', connection.target)) === type;
};

const FunctionNode = ({ data, selected }) => {
  return (
    <Node
      level={data.level}
      group={data.group}
      label={data.name}
      selected={selected}
      color={'Lavender'}
      content={
        <>
          <div style={style.contentHeader}>{'Inputs'}</div>
          {data.inputs.map(input => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <div key={'i-' + input.label} style={{ ...style.io }}>
              {input.label}
              <Handle
                type="target"
                position={Position.Left}
                id={'i-' + input.label + '__' + input.type}
                style={{ ...style.handle, ...style.left }}
                isValidConnection={connection => isValidInput(connection, input.type)}
              />
            </div>
          ))}
          <div style={style.contentHeader}>{'Outputs'}</div>
          {data.outputs.map(output => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <div key={'o-' + output.label} style={{ ...style.io }}>
              {output.label}
              <Handle
                type="source"
                position={Position.Right}
                id={'o-' + output.label + '__' + output.type}
                style={{ ...style.handle, ...style.right }}
                isValidConnection={connection => isValidOutput(connection, output.type)}
              />
            </div>
          ))}
        </>
      }
    />
  );
};

export default memo(FunctionNode);
