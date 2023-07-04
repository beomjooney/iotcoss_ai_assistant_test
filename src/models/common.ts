export interface ListApiResponseBase {
  totalCount: number;
  page: number;
  rowSize: number;
}

export interface ListApiResponse<T> extends ListApiResponseBase {
  data: T[];
}

export type ListApiResponseWithListKey<K extends string, V> = ListApiResponseBase & {
  [key in K]: V[];
};
