import React, { memo } from 'react';
import * as R from 'ramda';
import { Handle, Position } from 'react-flow-renderer';
import Node, { contentStyle as style } from './Node';

const isValidInput = (connection, type) => {
  return R.last(R.split('__', connection.sourceHandle)) === type;
};
const isValidOutput = (connection, type) => {
  return R.last(R.split('__', connection.targetHandle)) === type;
};

const QueryNode = ({ data, selected }) => {
  const expandnNcollapse = () => {
    setIsShow(() => !isShow);
  };
  const [isShow, setIsShow] = React.useState(true);

  return (
    <Node
      level={data.level}
      group={data.group}
      label={data.name}
      selected={selected}
      color={data.color}
      expandnCollapse={expandnNcollapse}
      exposeDetail={data.exposeDetail}
      showNhide={isShow}
      content={
        <>
          <div>
            <Handle
              type="target"
              position={Position.Left}
              id={'i-' + data.label + '__' + data.type}
              style={{ ...style.handle, ...style.left }}
              //   inPort={"In"}
              isValidConnection={connection => isValidInput(connection, data.type)}
              onConnect={params => console.log('handle onConnect', params)}
            />
            {/* <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} /> */}
            <Handle
              type="source"
              position={Position.Right}
              id={'o-' + data.label + '__' + data.type}
              style={{ ...style.handle, ...style.right }}
              isValidConnection={connection => isValidOutput(connection, data.type)}
              onConnect={params => console.log('handle onConnect', params)}
            />
          </div>

          <div>
            {/* {data.inputs.map(input => (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <div key={'i-' + input.label} style={{ ...style.io }}>
                
            ))} */}
            {/* <div style={style.contentHeader}>{'Outputs'}</div> */}
            {/* {data.outputs.map(output => (
              <div key={'o-' + output.label} style={{ ...style.io }}>
                {output.label + ' (' + output.description + ')'}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={'o-' + output.label + '__' + output.type}
                  style={{ ...style.handle, ...style.right }}
                  isValidConnection={connection => isValidOutput(connection, output.type)}
                  onConnect={params => console.log('handle onConnect', params)}
                />
              </div>
            ))} */}
          </div>
        </>
      }
    />
  );
};

export default memo(QueryNode);
