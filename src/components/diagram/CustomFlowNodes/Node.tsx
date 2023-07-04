import React, { memo } from 'react';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import Grid from '@mui/material/Grid';
export const contentStyle = {
  contentHeader: {
    padding: '8px 0px',
    flexGrow: 1,
    backgroundColor: '#eed',
  },
  io: {
    // position: 'relative',
    // padding: '4px 8px',
    flexGrow: 1,
  },
  // left: { left: '-8px' },
  // textLeft: { textAlign: 'left' },
  // right: { right: '-8px' },
  // textRight: { textAlign: 'right' },
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
  left: {},
  right: {},
};

const style = {
  body: {
    display: 'flex',
    flexDirection: 'column' as const,
    // backgroundColor: '#fff',
    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    // boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    border: '2px solid',
    borderStyle: 'solid',
    padding: '5px',
    // borderWidth: '2px',
    maxWidth: '400px',
    minWidth: '290px',
    height: '200px',
    textAlign: 'center' as const,
    borderColor: '#fff',
    borderRadius: 10,
    borderTopWidth: '50px',
    boxShadow: '0 0 0 2px #d0f1de,var(--bit-shadow-hover-medium)',
  },
  selected: {
    // boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    border: '2px solid red' as const,
    borderStyle: 'solid' as const,
    borderRadius: '7px' as const,
  },
  right: {},
  title: {
    // borderColor: '#37b26c',
    // borderRadius: '8px',
    position: 'relative' as const,
    // padding: '15px 15px',
    margin: '10px 15px 0px 15px',
    flexGrow: 1,
    fontSize: '20pt',
    color: '#000',
    fontWeight: 'bold',
    fontWight: 'bold',
    // backgroundColor: '#eee',
  },
  subTitle: {
    // borderColor: '#37b26c',
    // borderRadius: '8px',
    position: 'relative' as const,
    // padding: '15px 15px',
    textAlign: 'center' as const,
    margin: '0px 15px',
    flexGrow: 1,
    fontSize: '20pt',
    color: 'gray',
  },
  contentWrapper: {
    // padding: '8px 0px',
  },
  contentWrapperLevel: {
    fontSize: '20pt',
    top: '4px',
    bottom: '0',
    left: '0',
    right: '0',
    width: '100%',
    height: '100%',
    margin: 'auto',
    position: 'absolute' as const,
    color: 'white',
  },
};

interface NodeProps {
  level: string;
  group: string;
  label: string;
  selected: boolean;
  color?: string;
  content: React.ReactNode;
  expandnCollapse?: () => void;
  showNhide?: boolean;
  exposeDetail?: boolean;
}
const Node: React.FC<NodeProps> = ({ group, level, label, selected, color, exposeDetail, content }: NodeProps) => {
  let customTitle = { ...style.title };
  let customBody = { ...style.body };
  // if (color) customTitle.backgroundColor = color;
  if (color) customBody.borderColor = color;

  // Collapse contentWrapper on icon click
  return (
    // <div style={{ customBody, ...(selected ? style.selected : []) }}>
    <div style={selected ? style.selected : style.right}>
      <div style={customBody}>
        <div style={style.contentWrapperLevel}>
          <div className="ml-5 mr-5">
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              {level} {exposeDetail ? <PendingOutlinedIcon fontSize="large" /> : <div></div>}
            </Grid>
          </div>
          <div style={customTitle}>{label}</div>
          <div style={style.subTitle}>{group}</div>
        </div>
        {/* <div style={style.contentWrapper}> */}
        {/* <div style={style.contentWrapperLevel}></div> */}
        {content}
        {/* </div> */}
      </div>
    </div>
  );
};

export default memo(Node);
