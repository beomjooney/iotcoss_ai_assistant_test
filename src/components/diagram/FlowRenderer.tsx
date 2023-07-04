import React, { useImperativeHandle, useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  useReactFlow,
  useStoreApi,
} from 'react-flow-renderer';

import { Node } from '../drawer/NodeDrawer';
import { Edge } from '../drawer/EdgeDrawer';
import inputNode from './CustomFlowNodes/InputNode';
import QueryNode from './CustomFlowNodes/QueryNode';
import OutputNode from './CustomFlowNodes/OutputNode';
import DecisionNode from './CustomFlowNodes/QueryNode';
import DataNode from './CustomFlowNodes/DataNode';
import FunctionNode from './CustomFlowNodes/FunctionNode';
import ValueNode from './CustomFlowNodes/ValueNode';
import { usePostConnect } from '../../services/queries/use-edge';
import dagre from 'dagre';
import ButtonEdge from './CustomEdge';

const onLoad = reactFlowInstance => reactFlowInstance.fitView();
const onNodeContextMenu = (event, node) => {
  event.preventDefault();
  console.log('context menu:', node);
};

// dagre layout
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 319;
const nodeHeight = 170;

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const isVertical = direction === 'TB';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isVertical ? 'top' : 'left';
    node.sourcePosition = isVertical ? 'bottom' : 'right';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const edgeTypes = {
  buttonedge: ButtonEdge,
};

const HorizontalFlow = props => {
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(props.nodes, props.edges);
  const { fitView } = useReactFlow();
  const [loading, setLoading] = useState(props.flag);

  // console.log('props.ref : ', props);

  const onSuccess = useCallback(data => {
    setEdges(eds => addEdge({ ...data.data, type: ConnectionLineType.Bezier, animated: false }, eds));
  }, []);

  const onSuccessMutate = useCallback(data => {
    props.refetch();
  }, []);

  const onError = useCallback(err => {
    console.log('Error', err);
  }, []);

  const connectInfo = usePostConnect(onSuccessMutate, onError);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const nodeTypes = useMemo(
    () => ({
      inputNode: inputNode,
      queryNode: QueryNode,
      outputNode: OutputNode,
      decisionNode: DecisionNode,
      dataNode: DataNode,
      functionNode: FunctionNode,
      valueNode: ValueNode,
    }),
    [],
  );
  const store = useStoreApi();

  useEffect(() => {
    // console.log('setLoading(false)', loading);
    // setLoading(false);
  }, [loading]);

  useEffect(() => {
    // console.log('setLoading(true)', loading);
    setLoading(true);
    setNodes([...props.nodes]);
    // fitView();
  }, [props.nodes]);

  useEffect(() => {
    // console.log('props.fitViewFlag', props.fitViewFlag);
    setLoading(props.fitViewFlag);
  }, [props.fitViewFlag]);

  const onConnect = useCallback(params => {
    connectInfo.mutate(params);
  }, []);

  const onLayout = useCallback(
    direction => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
  );

  const onClickNode = (node: Node, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    console.log('click node');

    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    props.onClickNode(node, open);
  };

  const onClickEdge = (edge: Edge, open: boolean, id) => (event: React.KeyboardEvent | React.MouseEvent) => {
    console.log('click edge : ', edge);
    console.log('click edge : ', JSON.stringify(id));
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    props.onClickEdge(edge, open);
  };
  const onNodeClick = (evt, id) => {
    setLoading(false);
    evt.stopPropagation();
    console.log(`node click ${JSON.stringify(id.id)}`);
    props.onClickNode('right', true, id.id, id.data.exposeDetail);
  };

  const onEdgeClick = (evt, id) => {
    console.log('onEdgeClick :', id);
    evt.stopPropagation();
    console.log(`edge click ${JSON.stringify(id.id)}`);
    props.onClickEdge('right', true, id.id, id.exposeDetail);
  };

  return (
    <div style={{ height: 'calc(100vh - 150px)', border: '1px solid #ddd', borderRadius: '8px' }}>
      <ReactFlow
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          // overflow: 'auto',
          // overscrollBehavior: 'none',
          overflow: 'scroll',
        }}
        defaultPosition={[25, 50]}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onLoad={onLoad}
        // onNodeClick={onClickNode('right', true)}
        // onEdgeClick={onClickEdge('right', true)}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onNodeContextMenu={onNodeContextMenu}
        connectionLineType={ConnectionLineType.Straight}
        defaultZoom={0.45}
        preventScrolling={false}
        zoomOnPinch={false}
        panOnScroll={false}
        zoomOnScroll={false}
        nodesDraggable={false}
      >
        {/* <Background gap={24} size={1} /> */}
        <Controls />
        <MiniMap
          nodeColor={node => {
            switch (node.type) {
              case 'outputNode':
                return 'LightGreen';
              case 'valueNode':
                return 'LightGreen';
              case 'queryNode':
                return 'LightBlue';
              case 'dataNode':
                return 'LightBlue';
              case 'functionNode':
                return 'Lavender';
              case 'inputNode':
                return 'Gold';
              default:
                return '#eee';
            }
          }}
        />
      </ReactFlow>
      {/* <div className="controls">
        <button onClick={() => onLayout('TB')}>vertical layout</button>
        <button onClick={() => onLayout('LR')}>horizontal layout</button>
      </div> */}
    </div>
  );
};

// export default HorizontalFlow;
function FlowWithProvider(props) {
  return (
    <ReactFlowProvider>
      <HorizontalFlow {...props} />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;
