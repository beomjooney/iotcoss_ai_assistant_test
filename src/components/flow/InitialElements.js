import { Position } from 'react-flow-renderer';
import { Button, Card } from '@shopify/polaris';
import { CirclePlusMinor, MobileCancelMajor, CustomerPlusMajor } from '@shopify/polaris-icons';

export const TriggerNode = ({ onAdd }) => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{
        color: '#888',
        backgroundColor: '#eee',
        borderRadius: 3,
        padding: 4,
      }}
    >
      {'Product added to cart'}
    </div>
    <br />
    <div
      onClick={onAdd}
      style={{
        color: '#888',
        backgroundColor: '#eee',
        borderRadius: 3,
        padding: 4,
      }}
    >
      {'+ Add trigger'}
    </div>
  </div>
);

const ConditionNode = () => (
  <Card>
    <div style={{ textAlign: 'center', padding: 8 }}>
      <div
        style={{
          color: '#888',
          backgroundColor: '#eee',
          borderRadius: 3,
          padding: 4,
        }}
      >
        {'variant = 3398765142'}
      </div>
      <div
        style={{
          color: '#aaa',
          padding: 4,
          textTransform: 'uppercase',
          fontSize: 10,
          fontWeight: 'bold',
        }}
      >
        and
      </div>
      <div>
        <div
          style={{
            color: '#888',
            backgroundColor: '#eee',
            borderRadius: 3,
            padding: 4,
          }}
        >
          {'cart total ≥ 200.00'}
        </div>
      </div>
    </div>
  </Card>
);

const NodeTypeNode = ({ onAdd }) => (
  <div style={{ textAlign: 'center' }}>
    <div
      onClick={onAdd}
      style={{
        color: '#888',
        backgroundColor: '#eee',
        borderRadius: 3,
        padding: 4,
      }}
    >
      {'+ Add condition'}
    </div>
    <br />
    <div
      onClick={onAdd}
      style={{
        color: '#888',
        backgroundColor: '#eee',
        borderRadius: 3,
        padding: 4,
      }}
    >
      {'+ Add action'}
    </div>
    <br />
    <div
      onClick={onAdd}
      style={{
        color: '#888',
        backgroundColor: '#eee',
        borderRadius: 3,
        padding: 4,
      }}
    >
      {'+ Add test'}
    </div>
  </div>
);

export const nodes = [
  {
    id: '1',
    type: 'componentNode',
    data: {
      label: 'start when',
      //   component: () => <TriggerNode onAdd={() => {setSheetActive(true)}} />
      component: () => <TriggerNode onAdd={() => console.log(1)} />,
    },
    style: { padding: 10 },
    position: { x: 200, y: 30 },
  },
  {
    id: '2',
    type: 'componentNode',
    data: {
      label: 'if',
      component: () => <ConditionNode />,
    },
    position: { x: 200, y: 250 },
    sourcePosition: Position.Top,
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output A' },
    position: { x: 600, y: 304 },
    targetPosition: Position.Left,
  },
  {
    id: '4',
    type: 'componentNode',
    data: {
      label: "what's next?",
      //   component: () => <NodeTypeNode onAdd={() => setSheetActive(true)} />
      component: () => <NodeTypeNode onAdd={() => console.log(2)} />,
    },
    position: { x: 200, y: 470 },
    sourcePosition: Position.Top,
  },
];

export const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'no',
    // animated: true,
    // style: { stroke: "#ccc" },
    type: 'smoothstep',
    label: 'Yes',
    //   labelStyle: { fill: "#aaa", fontWeight: "bold" },
    labelBgBorderRadius: 10,
    //   labelBgStyle: { strokeWidth: 1, stroke: "#ccc" },
    //   labelBgPadding: [8, 4] // 왜 안먹는지 모르겠음 확인 필요
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    sourceHandle: 'yes',
    // animated: true,
    // style: { stroke: "#ccc" },
    type: 'smoothstep',
    //   labelStyle: { fill: "#aaa", fontWeight: "bold" },
    //   labelBgBorderRadius: 10,
    //   labelBgStyle: { strokeWidth: 1, stroke: "#ccc" },
    //   labelBgPadding: [8, 4],
    //   data: {
    //     component: <CustomerPlusMajor/>
    //   }
  },
  // {
  //   id: "e2a-3",
  //   source: "2",
  //   target: "3",
  //   sourceHandle: "a",
  //   // animated: true,
  //   // style: { stroke: "#ccc" },
  //   type: "smoothstep",
  //   label: "Yes",
  //   labelStyle: { fill: "#aaa", fontWeight: "bold" },
  //   labelBgBorderRadius: 10,
  //   labelBgStyle: { strokeWidth: 1, stroke: "#ccc" },
  //   labelBgPadding: [8, 4]
  // },
  {
    id: 'e2b-4',
    source: '2',
    target: '4',
    sourceHandle: 'no',
    type: 'smoothstep',
    label: 'No',
    //   labelStyle: { fill: "#aaa", fontWeight: "bold" },
    labelBgBorderRadius: 10,
    //   labelBgStyle: { strokeWidth: 1, stroke: "#ccc" },
    //   labelBgPadding: [8, 4]
  },
];
