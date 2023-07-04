export interface EdgeResponse {
  [key: string]: any;
  data: {
    data: Edge[];
  };
}

export interface Edge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  animated: boolean;
}
