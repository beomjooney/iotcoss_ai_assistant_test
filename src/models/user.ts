export interface MyMentorListResponse {
  [key: string]: any;
  data: {
    /** 회원 아이디*/
    memberId: string;
    mentors: User[];
  };
}

export interface MentorListResponse {
  [key: string]: any;
  data: User[];
}

export interface User {
  /** 소개 말 */
  introductionMessage?: string;
  /** 회원 아이디*/
  memberId: string | [];
  /** 회원 타입 - 게스트 / 일반 회원 */
  memberType?: 'Guest' | string;
  /** 이름 */
  name?: string;
  /** 닉네임 */
  nickname?: string;
  /** 이메일 */
  email?: string;
  /** 연령대 */
  ageRange?: string;
  /** 생일 */
  birthday?: string;
  /** 유저타입 (멘토/멘티) */
  type?: string;
  /** 유저타입명 (멘토/멘티) */
  typeName?: string;
  /** 직군 */
  jobGroup?: string;
  /** 직군명 */
  jobGroupName?: string;
  /** 레벨 */
  level?: number;
  /** 프로필 이미지 */
  profileImageUrl?: string;
  /** 인증방식 */
  authProvider?: string;
  /** sns url */
  snsUrl?: string[];
  /** 로그인 실패 횟수 */
  loginFailCount?: number;
  /** 권한 */
  roles?: string[];
  /** 전화번호 */
  phoneNumber?: string;
  emailReceiveYn?: boolean;
  smsReceiveYn?: boolean;
  kakaoReceiveYn?: boolean;
}

// 학습자 관련 인터페이스 추가
export interface JobGroup {
  code: string;
  name: string;
}

export interface Job {
  code: string;
  name: string;
}

export interface StudentMember {
  memberUUID: string;
  memberId: string;
  memberUri: string;
  profileImageUrl: string | null;
  nickname: string;
  jobGroup: JobGroup;
  job: Job;
  companyName: string | null;
  experienceYears: number | null;
  skills: any[];
  introductionMessage: string | null;
}

export interface StudentContent {
  member: StudentMember;
  registeredAt: string;
}

export interface MyStudentsListResponse {
  [key: string]: any;
  data: {
    contents: StudentContent[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
}

// 클럽/강의 관련 인터페이스 추가
export interface Instructor {
  memberUUID: string;
  memberUri: string;
  profileImageUrl: string | null;
  nickname: string;
  memberId: string;
}

export interface ClubContent {
  clubSequence: number;
  clubName: string;
  jobGroups: JobGroup[];
  jobs: Job[];
  startAt: string;
  endAt: string;
  instructor: Instructor;
  status: string;
  comprehensiveEvaluationEnabled: boolean;
  comprehensiveEvaluationViewable: boolean;
}

export interface MyClubsListResponse {
  [key: string]: any;
  data: {
    contents: ClubContent[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
}
