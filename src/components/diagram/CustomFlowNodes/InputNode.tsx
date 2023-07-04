import { memo, useState } from 'react';
import * as R from 'ramda';
import { Handle, Position } from 'react-flow-renderer';
import Node, { contentStyle as style } from './Node';

const isValidConnection = connection => {
  return R.last(R.split('__', connection.targetHandle)) === 'data';
};

const InputNode = ({ data, selected }) => {
  const expandnNcollapse = () => {
    setIsShow(() => !isShow);
  };
  const [isShow, setIsShow] = useState<boolean>(true);

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <div style={style.io}>
          <Handle
            type="source"
            position={Position.Right}
            id="o__data"
            style={{ ...style.handle, ...style.right }}
            isValidConnection={isValidConnection}
            onConnect={params => console.log('handle onConnect', params)}
          />
          {/* <div style={style.io}>{data.description}</div> */}
        </div>
      }
    />
  );
};

export default memo(InputNode);
