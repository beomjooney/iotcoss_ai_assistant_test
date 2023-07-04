import { JwtPayload } from 'jwt-decode';

export interface UserInfo extends JwtPayload {
  nickname?: string;
  roles: any[];
}

export interface Terms {
  termsId: string;
  type: string;
  content: string;
  firmDate: string;
  enforcementDate: string;
  previousTermsId: string;
  createdAt: string;
  creatorId: string;
  updatedAt: string;
  updaterId: string;
}

export interface Token {
  token_type: string;
  access_token: string;
}
