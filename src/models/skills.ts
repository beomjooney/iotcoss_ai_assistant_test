export interface MySkillResponse {
  memberId: string;
  skills: Skill[];
}

export type SkillResponse = Skill[];

export interface Skill {
  /** 스킬 ID */
  skillId: string;
  /** 스킬명 */
  skillName: string;
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
