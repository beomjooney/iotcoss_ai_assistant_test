export interface MyExperienceResponse {
  memberId: string;
  experiences: Experience[];
}
export type ExperiencesResponse = Experience[];

export interface Experience {
  /** 경험 ID */
  experienceId: string;
  /** 경험명 */
  experienceName: string;
  /** 설명 */
  description: string;
  /** 이미지 url */
  imageUrl: string;
  /** 관련 직군 */
  relatedJobGroups: string[];
  /** 관련 직군명 */
  relatedJobGroupNames: string[];
  /** 관련 직업 */
  relatedJobs: string[];
  /** 관련 직업명 */
  relatedJobNames: string[];
  /** 관련 레벨 */
  relatedLevels: number[];
  /** 트렌드 레벨 */
  trendLevel: number;
  /** 활성화 레벨 */
  activeLevel: number;
  /** 생성일 */
  createdAt: string;
  /** 수정일 */
  updatedAt: string;
}
