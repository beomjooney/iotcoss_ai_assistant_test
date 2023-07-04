import React, { useCallback, useState } from 'react';
import ReactFlow, {
  isEdge,
  addEdge,
  MiniMap,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  Position,
} from 'react-flow-renderer';
import ColorSelectorNode from './color-selector-node';
import ComponentNode from './component-node';
import { Button, Card, Heading, ResourceItem, ResourceList, Scrollable, Sheet } from '@shopify/polaris';
import { MobileCancelMajor } from '@shopify/polaris-icons';
// import "./index.css";

import { nodes as initialNodes, edges as initialEdges } from './InitialElements';

const onInit = reactFlowInstance => console.log('flow loaded:', reactFlowInstance);

const onLoad = (reactFlowInstance: any) => {
  console.log('flow loaded:', reactFlowInstance);
  setTimeout(() => reactFlowInstance.fitView(), 1);
};

const onNodeDragStop = (event: any, node: any) => console.log('drag stop', node);
const onElementClick = (event: any, element: any) => console.log('click', element);
const initBgColor = '#eee';
const connectionLineStyle = { stroke: '#ccc' };
const snapGrid = [20, 20] as [number, number];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
  componentNode: ComponentNode,
};

const CustomNodeFlow = () => {
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);
  const [bgColor, setBgColor] = React.useState(initBgColor);

  const [sheetActive, setSheetActive] = React.useState(false);
  const toggleSheetActive = React.useCallback(() => setSheetActive(sheetActive => !sheetActive), []);

  const [salesChannels, setSalesChannels] = React.useState([
    { value: 'onlineStore', label: 'Online Store' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'googleShopping', label: 'Google shopping' },
    { value: 'facebookMarketing', label: 'Facebook Marketing' },
  ]);
  const [selected, setSelected] = React.useState([]);
  const handleSelectedChange = React.useCallback(value => setSelected(value), []);

  React.useEffect(() => {
    const onChange = (event: any) => {
      setEdges(edgs =>
        edgs.map((e: any) => {
          if (isEdge(e) || e.id !== '2') {
            return e;
          }
          const color = event.target.value;
          setBgColor(color);
          return {
            ...e,
            data: {
              ...e.data,
              color,
            },
          };
        }),
      );
    };
  }, []);

  // const onNodesChange = React.useCallback(
  //   (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
  //   []
  // );
  // const onEdgesChange = React.useCallback(
  //   (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
  //   []
  // );
  // const onConnect = React.useCallback((connection) => setEdges((eds) => addEdge(connection, eds)));

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        // onElementClick={onElementClick}
        // onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        style={{ background: bgColor }}
        onLoad={onLoad}
        nodeTypes={nodeTypes}
        connectionLineStyle={connectionLineStyle}
        snapToGrid={true}
        snapGrid={snapGrid}
        defaultZoom={1}
      >
        {/* <MiniMap
            nodeStrokeColor={(n) => {
              if (n.type === "input") return "#0041d0";
              if (n.type === "selectorNode") return bgColor;
              if (n.type === "output") return "#ff0072";
            }}
            nodeColor={(n) => {
              if (n.type === "selectorNode") return bgColor;
              return "#fff";
            }}
          /> */}
        <Controls />
      </ReactFlow>

      <Sheet open={sheetActive} onClose={toggleSheetActive} accessibilityLabel="">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              borderBottom: '1px solid #DFE3E8',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1.6rem',
              width: '100%',
            }}
          >
            <Heading>Select a trigger to start your workflow</Heading>
            <Button accessibilityLabel="Cancel" icon={MobileCancelMajor} onClick={toggleSheetActive} plain />
          </div>
          <Scrollable style={{ height: '100%' }}>
            <ResourceList
              resourceName={{ singular: 'trigger', plural: 'triggers' }}
              items={[
                {
                  id: 1,
                  name: 'Product viewed',
                  description: 'A visitor views a product detail page.',
                },
                {
                  id: 2,
                  name: 'Product added to cart',
                  description: 'A visitor added a product to their cart.',
                },
                {
                  id: 3,
                  name: 'Product removed from cart',
                  description: 'A visitor removed a product from their cart.',
                },
                {
                  id: 4,
                  name: 'Cart viewed',
                  description: 'A visitor views the cart page.',
                },
                {
                  id: 5,
                  name: 'Clicked checkout',
                  description: 'A visitor clicked the checkout button.',
                },
                {
                  id: 6,
                  name: 'Completed checkout',
                  description: 'A visitor completes checkout.',
                },
                {
                  id: 7,
                  name: 'Checkout order status viewed',
                  description: 'A visitor views the checkout order status page.',
                },
              ]}
              renderItem={item => {
                const { id, name, description } = item;
                // const media = <Avatar customer size="medium" name={name} />;

                return (
                  <ResourceItem
                    id={id.toString()}
                    onClick={() => console.log(1)}
                    // url={url}
                    // media={media}
                    accessibilityLabel={`View details for ${name}`}
                    // shortcutActions={shortcutActions}
                  >
                    <Card title={name} sectioned>
                      {description}
                    </Card>
                  </ResourceItem>
                );
              }}
            />
          </Scrollable>
          <div
            style={{
              alignItems: 'center',
              borderTop: '1px solid #DFE3E8',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1.6rem',
              width: '100%',
            }}
          >
            <Button onClick={toggleSheetActive}>Cancel</Button>
            <Button primary onClick={toggleSheetActive}>
              Done
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  );
};

export default CustomNodeFlow;
