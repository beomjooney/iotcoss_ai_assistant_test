export interface CommunityResponse {
  [key: string]: any;
  data: CommunityObject[];
  /** 페이징 처리를 위한 값 */
  nextPage?: number;
  totalPage?: number;
}

export interface RepliesResponse {
  // [key: string]: any;
  data: RepliesObject[];
}

export interface RepliesObject {
  postReplyNo: number;
  parentPostNo: number;
  body: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  memberId: string;
  name: string;
  nickname: string;
  type: string;
  typeName: string;
  jobGroup: string;
  jobGroupName: string;
  level: number;
  profileImageUrl: string;
  introductionMessage: string;
}

export interface Author {
  memberId: string;
  name: string;
  nickname: string;
  type: string;
  typeName: string;
}

export interface CommunityObject {
  postNo: number;
  postCategory: string;
  postCategoryName: string;
  title: string;
  body: string;
  keywords: string[];
  author: Author;
  replyCount: number;
  likeReactionCount: number;
  liked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KeyworldObject {
  popularKeywords: [];
}

export interface MentoObject {
  memberId: string;
  name: string;
  nickname: string;
  email: string;
  roles: string[];
  ageRange: string;
  birthday: string;
  type: string;
  typeName: string;
  jobGroup: string;
  jobGroupName: string;
  level: number;
  introductionMessage: string;
  customSkills: string[];
  customExperiences: string[];
  profileImageUrl: string;
  authProvider: string;
  snsUrl: string[];
  loginFailCount: number;
  emailReceiveYn: boolean;
  smsReceiveYn: boolean;
  popularity: number;
  createdAt: string;
  creatorId: string;
  updatedAt: string;
  updaterId: string;
}
