import { ArticleType } from '../config/types';
import { User } from './user';

export interface RecommendContentsResponse {
  [key: string]: any;
  data: RecommendContent[];
  /** 페이징 처리를 위한 값 */
  nextPage?: number;
  totalPage?: number;
}

export interface RecommendContent {
  /** 아이디 */
  contentsId?: string;
  /** 제공자 */
  provider?: string;
  /** 컨텐츠 이름 */
  contentsName: string;
  /** 컨텐츠 타입 */
  contentsType: ArticleType;
  /** 컨텐츠 타입명 */
  contentsTypeName: string;
  /** 설명 */
  description?: string;
  /** 추천 직군 그룹 코드 목록 */
  recommendJobGroups: string[];
  /** 추천 직군 그룹 목록명 */
  recommendJobGroupNames: string[];
  /** 추천 직군 코드 목록 */
  recommendJobs: string[];
  /** 추천 직군 목록명 */
  recommendJobNames: string[];
  /** 추천 레벨 목록 */
  recommendLevels: number[];
  /** 소요 시간 */
  estimatedViewTime?: number;
  /** 결제 유형 코드 */
  paymentType: string;
  /** 결제 유형명 */
  paymentTypeName: string;
  /** 가격 */
  price: number;
  /** 등록일자 */
  registDate: string;
  /** 생성자 */
  creator: string;
  /** 키워드 목록 */
  keywords: string[];
  /** 관련 스킬 코드 목록 */
  relatedSkills: string[];
  /** 관련 경험 코드 목록 */
  relatedExperiences: string[];
  /** 회원 추천 횟수 */
  memberRecommendCount: number;
  /** 회원 조회 횟수 */
  memberViewCount: number;
  /** 이미지 url */
  imageUrl: string;

  // TODO 세미나 타입 나누기
  recommendQuotes?: number;
  /** 추천 레벨 */
  internalRecommendLevel: 0 | 1 | 2 | 3 | 4 | 5;
  /** 세미나 장소 코드 */
  seminarVenueType?: string;
  /** 세미나 장소 코드명 */
  seminarVenueTypeName?: string;
  /** 생성 일시 */
  createdAt: string;
  /** 세미나 제목 */
  seminarTitle?: string;
  /** 세미나 부제목 */
  seminarSubTitle?: string;
  /** 세미나 소개 */
  seminarIntroduction?: string;
  /** 세미나 커리큘럼 */
  seminarCurriculum?: string;
  /** 세미나 FAQ */
  seminarFaq?: string;
  url?: string;
  /** 이미지1 - 멘토님 상반신 사진 */
  imageUrl1?: string;
  /** 이미지2 - 세미나 장표#1 */
  imageUrl2?: string;
  /** 이미지3 - 세미나 장표#2 */
  imageUrl3?: string;
  /** 생성자 */
  organizerMemberId?: string;
  /** 세미나 강사 */
  seminarLecturer?: User;
  /** 등록 시작 일자 */
  seminarRegistrationStartDate?: string;
  /** 등록 종료 일자 */
  seminarRegistrationEndDate?: string;
  /** 모집 인원 수 */
  participantCount?: number;
  /** 참여 신청 수 */
  currentParticipantCount?: number;
  /** 세미나 상태 코드 */
  seminarStatus?: string;
  /** 세미나 상태 코드명 */
  seminarStatusName?: string;
  /** 세미나 유형 코드 */
  seminarType?: string;
  /** 세미나 유형 코드명 */
  seminarTypeName?: string;
  /** 세미나 시작 일시 */
  seminarStartDate?: string;
  /** 세미나 종료 일시 */
  seminarEndDate?: string;
  /** 세미나 장소 타입 */
  seminarPlaceType?: string;
  /** 세미나 장소명 */
  seminarPlaceTypeName?: string;
  /** 세미나 세부 장소 */
  seminarPlace?: string;
  /** 추천 스킬 목록 */
  recommendSkills?: string[];
  /** 추천 경험 목록 */
  recommendExperiences?: string[];
  /** 수정 일시 */
  updatedAt?: string;
  /** 세미나 명 */
  seminarName?: string;
  /** 프로모션 날짜 */
  promotionData?: string;
  /** 강사 아이디 */
  lecturerMemberId?: string;
  /** 강사명 */
  lecturerName?: string;
  /** 세미나 아이디 */
  seminarId?: string;
  /** 나의 참여 현황*/
  myParticipant?: SeminarParticipant;
  /** 클럽 상태 */
  clubStatus?: string;
  /** 클럽 멤버 상태 */
  clubMemberStatus?: string;
}
export interface SeminarContent {
  /** 세미나 아이디 */
  seminarId?: string;
  /** 세미나 제목 */
  seminarTitle?: string;
  /** 세미나 부제목 */
  seminarSubTitle?: string;
  /** 세미나 소개 */
  seminarIntroduction?: string;
  /** 세미나 커리큘럼 */
  seminarCurriculum?: string;
  /** 세미나 FAQ */
  seminarFaq?: string;
  /** 설명 */
  description?: string;
  /** 링크 */
  url?: string;
  /** 이미지1 - 멘토님 상반신 사진 */
  imageUrl1?: any;
  /** 이미지2 - 세미나 장표#1 */
  imageUrl2?: any;
  /** 이미지3 - 세미나 장표#2 */
  imageUrl3?: any;
  /** 생성자 */
  organizerMemberId?: string;
  /** 세미나 강사 */
  seminarLecturer?: User;
  /** 등록 시작 일자 */
  seminarRegistrationStartDate?: string;
  /** 등록 종료 일자 */
  seminarRegistrationEndDate?: string;
  /** 모집 인원 수 */
  participantCount?: number;
  /** 참여 신청 수 */
  currentParticipantCount?: number;
  /** 결제 유형 코드 */
  paymentType?: string;
  /** 결제 유형명 */
  paymentTypeName?: string;
  /** 가격 */
  price?: number;
  /** 키워드 목록 */
  keywords?: string[];
  /** 세미나 상태 코드 */
  seminarStatus?: string;
  /** 세미나 상태 코드명 */
  seminarStatusName?: string;
  /** 세미나 유형 코드 */
  seminarType?: string;
  /** 세미나 유형 코드명 */
  seminarTypeName?: string;
  /** 세미나 시작 일시 */
  seminarStartDate?: string;
  /** 세미나 종료 일시 */
  seminarEndDate?: string;
  /** 세미나 장소 타입 */
  seminarPlaceType?: string;
  /** 세미나 장소명 */
  seminarPlaceTypeName?: string;
  /** 세미나 세부 장소 */
  seminarPlace?: string;
  /** 추천 직군 그룹 코드 목록 */
  recommendJobGroups?: string[];
  /** 추천 직군 그룹 목록명 */
  recommendJobGroupNames?: string[];
  /** 추천 직군 코드 목록 */
  recommendJobs?: string[];
  /** 추천 직군 목록명 */
  recommendJobNames?: string[];
  /** 추천 레벨 목록 */
  recommendLevels?: number[];
  /** 추천 스킬 목록 */
  recommendSkills?: string[];
  /** 추천 경험 목록 */
  recommendExperiences?: string[];
  /** 수정 일시 */
  updatedAt?: string;
  /** 세미나 명 */
  seminarName?: string;
  /** 프로모션 날짜 */
  promotionData?: string;
  /** 강사 아이디 */
  lecturerMemberId?: string;
  /** 강사명 */
  lecturerName?: string;
  /** 등록일자 */
  registDate: string;
}
export interface SeminarParticipant {
  seminarId: string;
  memberId: string;
  registDate: string;
  approvalStatus: string;
  approvalStatusName: string;
  noShow: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SeminarImages {
  bannerId: string;
  order: number;
  imageUrl: string;
  linkUrl: string;
  exposureDurationSec: number;
  exposureStartDate: string;
  exposureEndDate: string;
  createdAt: string;
  updatedAt: string;
}
