// TODO 변경 사항 반영 필요
// export interface MemberType {
//   /** UUID */
//   uuid: string;
//   /** 아이디 */
//   id: string;
//   /** 타입 */
//   type: 'mentor' | 'mentee';
//   /** 이름 */
//   name: string;
//   /** 닉네임 */
//   nickname: string;
//   /** 이메일 */
//   email: string;
//   /** 휴대폰 번호 */
//   phone: string;
//   /** 이미지 */
//   profileImage?: string;
//   /** 레벨 */
//   level?: number;
//   /** 직업 */
//   job?: string;
//   /** TODO API 제공 형태에 따라 재개발 필요*/
//   career: {
//     /** 커리어 그룹 = 성장 분야 */
//     categoryGroupName?: string;
//   };
// }

/** 게시판 */
export interface BoardType {
  /** 번호 */
  postNo: number;
  /** 카테고리 ID */
  categoryId: number;
  /** 제목 */
  title?: string;
  /** 내용 */
  body?: string;
  /** 작성자 ID */
  writerID?: string;
  /** 좋아요 수 */
  likeReactionCount?: number;
  /** 리액션 수 */
  replyCount?: number;
  /** 작성날짜 */
  createdAt?: Date;
  /** 해시태그 */
  keywords?: string[] | [];
  relatedJobGroupNames?: string[] | [];
  relatedLevels?: string[] | [];
  author?: authorType;
  liked: boolean;
}

/** author */
// export interface authorType {
//   /** 번호 */
//   // nickname: string;
//   // typeName: string;
//   // type: string;
//   // profileImageUrl: string;
//   // level: string;
//   // jobGroupName: string;
//   memberId: string;
//   name: string;
//   nickname: string;
//   type: string;
//   typeName: string;
//   jobGroup: string;
//   jobGroupName: string;
//   level: number;
//   profileImageUrl: string;
//   introductionMessage: string;
// }

/** 댓글 */
// export interface ReplyType {
//   /** 번호 */
//   no: number;
//   /** 게시판 ID */
//   boardNo: number;
//   /** 내용 */
//   content?: string;
//   /** 작성자 ID */
//   writerID?: string;
// }

export interface ReplyType {
  replies: any;
  postReplyNo: number;
  parentPostNo: number;
  body: string;
  author: authorType;
  createdAt: Date;
  updatedAt: Date;
}
export interface authorType {
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
  authenticatedYn: boolean;
}
