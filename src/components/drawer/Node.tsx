import React, { memo } from 'react';

export const contentStyle = {
  contentHeader: {
    padding: '8px 0px',
    flexGrow: 1,
    backgroundColor: '#eed',
  },
  io: {
    position: 'relative',
    padding: '4px 8px',
    flexGrow: 1,
  },
  // left: { left: '-8px' },
  // textLeft: { textAlign: 'left' },
  // right: { right: '-8px' },
  textRight: { textAlign: 'right' },
  inline: { display: 'inline-block' },

  handle: {
    widht: '', // Does not work
    height: '',
    margin: 'auto',
    background: '#ddd',
    borderRadius: '15px',
    border: '2px solid #ddd',
    // 'z-index': '1000',
    boxShadow:
      'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px',
  },
  right: {},
  left: {},
};

const style = {
  body: {
    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    border: '1px solid #0041d0;',
    fontSize: '10pt',
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#0041d0',
    background: '#fff',
    borderLeft: 'solid 10px #8b8bf2',
    // borderColor: 'solid linear-gradient(to right, #ff0072, #0041d0)',
    // borderWidth: '1px',
    maxWidth: '300px',
    minWidth: '164px',
    // padding: '0px 20px 0px 20px',
    // textAlign: 'left',
  },
  selected: {
    // boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
  title: {
    position: 'relative',
    padding: '8px 32px',
    flexGrow: 1,
    backgroundColor: '#eee',
  },
  contentWrapper: {
    padding: '8px 0px',
  },
};

interface NodeProps {
  label: string;
  selected: boolean;
  color?: string;
  content: React.ReactNode;
  expandnCollapse?: () => void;
  showNhide?: boolean;
}

const Node: React.FC<NodeProps> = ({ label, selected, color, content }: NodeProps) => {
  let customTitle = { ...style.title };
  if (color) customTitle.backgroundColor = color;

  // Collapse contentWrapper on icon click
  return (
    <div style={{ ...style.body, ...(selected ? style.selected : []) }}>
      {/* <div style={customTitle}>{label}</div> */}
      <div style={style.contentWrapper}>{content}</div>
    </div>
  );
};

export default memo(Node);
