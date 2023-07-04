import React, { useState, useCallback } from 'react';
import Drawer from '@mui/material/Drawer';
import EdgeInfo from './EdgeInfo';
import useDidMountEffect from '../../hooks/useDidMountEffect';
import { useEdgeInfo } from 'src/services/edge/edge.queries';
export type Edge = 'top' | 'left' | 'bottom' | 'right';

const EdgeDrawer = props => {
  const [pathId, setPathId] = useState('');
  // console.log('EdgeDrawer ', props.pathId);

  // setPathId(props.pathId);

  const { isLoading, isFetching, data, refetch } = useEdgeInfo(props.pathId);
  // console.log('edgeInfo : ', data);
  useDidMountEffect(() => {
    // console.log('call refetch');
    refetch();
  }, [props.pathId]);

  const toggleDrawer = (anchor: Edge, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    // console.log('click node drawer');

    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    props.onClick(anchor, open);
  };
  return (
    <Drawer anchor={'right'} open={props.drawerState['right']} onClose={toggleDrawer('right', false)}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <EdgeInfo
          profile={data?.data}
          // talkList={talkListData?.data}
          // testList={state}
          onBackPress={props.onClickClose}
        />
      )}
      {/* {talkListFetching ? (
        <div>Loading...</div>
      ) : (
        <div>test</div>
        <EdgeInfo
          // profile={profileData?.data}
          talkList={talkListData?.data}
          testList={state}
          onBackPress={props.onClickClose}
        />
      )} */}
    </Drawer>
  );
};

export default EdgeDrawer;
