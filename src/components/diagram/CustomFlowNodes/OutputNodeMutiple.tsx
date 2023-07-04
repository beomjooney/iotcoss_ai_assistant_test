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

const OutputNode = ({ data, selected }) => {
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
      color={'LightGreen'}
      expandnCollapse={expandnNcollapse}
      showNhide={isShow}
      content={
        <>
          {/* <div style={style.io}>{data.label}</div> */}
          {/* <div style={style.contentHeader}>{'Header'}</div> */}
          {/* {data.header.map(header => (
            <div key={'h-' + header.label} style={{ ...style.io }}>
              {header.description + ' (' + header.label + ')'}
              <Handle
                type="target"
                position={Position.Left}
                id={'h-' + header.label + '__' + header.type}
                style={{ ...style.handle, ...style.left }}
                // inPort={"In"}
                isValidConnection={connection => isValidInput(connection, header.type)}
              />
            </div>
          ))} */}
          {/* <div style={style.contentHeader}>{'Items'}</div> */}
          {data.items.map(item => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <div key={'i-' + item.label} style={{ ...style.io }}>
              {/* {item.description + ' (' + item.label + ')'} */}
              {item.description}
              <Handle
                type="target"
                position={Position.Left}
                id={'i-' + item.label + '__' + item.type}
                style={{ ...style.handle, ...style.left }}
                // inPort={"In"}
                isValidConnection={connection => isValidInput(connection, item.type)}
              />
            </div>
          ))}
          {/* <div style={style.contentHeader}>{'Controllers'}</div>
          {data.controllers.map(controller => (
            <div key={'c-' + controller.label} style={{ ...style.io }}>
              {controller.description + ' (' + controller.label + ')'}
              <Handle
                type="target"
                position={Position.Left}
                id={'c-' + controller.label + '__' + controller.type}
                style={{ ...style.handle, ...style.left }}
                // inPort={"In"}
                isValidConnection={connection => isValidInput(connection, controller.type)}
              />
            </div>
          ))} */}
        </>
      }
    />
  );
};

export default memo(OutputNode);
