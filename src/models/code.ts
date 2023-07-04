export interface CodeGroupResponse {
  [key: string]: any;
  data: CodeGroup[];
}

export type CodeResponse = Code[];

export interface CodeGroup {
  id: string;
  name: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Code {
  id: string;
  groupId: string;
  name: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
