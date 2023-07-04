export interface ReqResUsersResponse {
  [key: string]: any;
  data: {
    data: ReqResUsers;
  };
}

export interface ReqResUsers {
  data: ReqResUserData[];
}

export interface ReqResUserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
