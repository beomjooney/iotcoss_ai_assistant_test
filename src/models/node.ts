export interface NodeResponse {
  [key: string]: any;
  data: Node[];
}

export interface Input {
  label: string;
  description: string;
  type: string;
}

export interface Output {
  label: string;
  description: string;
  type: string;
}

export interface Header {
  label: string;
  description: string;
  type: string;
}

export interface Item {
  label: string;
  description: string;
  type: string;
}

export interface Controller {
  label: string;
  description: string;
  type: string;
}

export interface Data {
  name: string;
  label: string;
  description: string;
  inputs: Input[];
  outputs: Output[];
  header: Header[];
  items: Item[];
  controllers: Controller[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  type: string;
  data: Data;
  position: Position;
}
