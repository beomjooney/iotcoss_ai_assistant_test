export interface TalkListResponse {
  [key: string]: any;
  data: {
    data: TalkList[];
  };
}

export interface TalkList {
  name: string;
  description: string;
  date: string;
  unreadMessage: string;
  status: string;
}
