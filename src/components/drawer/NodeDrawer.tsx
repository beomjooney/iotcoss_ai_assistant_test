import React, { useState, useCallback } from 'react';
import Drawer from '@mui/material/Drawer';
import NodeInfo from './NodeInfo';
import useDidMountEffect from '../../hooks/useDidMountEffect';
// import { useNodeProfile } from '../../services/queries/use-node-profile';
import { useNodeInfo } from 'src/services/node/node.queries';
export type Node = 'top' | 'left' | 'bottom' | 'right';

const NodeDrawer = props => {
  const onSuccess = useCallback(data => {
    console.log('Success', data);
  }, []);

  const onError = useCallback(err => {
    console.log('Error', err);
  }, []);

  const { isLoading, isFetching, data, refetch } = useNodeInfo(props.nodeId, onSuccess, onError);
  useDidMountEffect(() => {
    console.log('call node refetch');
    refetch();
  }, [props.nodeId]);

  // const queries = () => {
  //   // const profileResponse = useProfile(onSuccess, onError);
  //   const talkListResponse = useTalkList(onSuccess, onError);
  //   return [talkListResponse];
  // };

  // const [{ isLoading: talkListLoading, isFetching: talkListFetching, data: talkListData }] = queries();

  const toggleDrawer = (anchor: Node, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    console.log('click node drawer');

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
      {isLoading ? <div>Loading...</div> : <NodeInfo profile={data?.data} onBackPress={props.onClickClose} />}
    </Drawer>
  );
};

export default NodeDrawer;
