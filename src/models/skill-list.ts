export interface SkillListResponse {
  [key: string]: any;
  data: {
    forEach(arg0: (value: any, index: any, array: any) => void): unknown;
    data: SkillList[];
  };
}

export interface SpeakerList {
  id: number;
  name: string;
  belong: string;
  introduction: string;
  contact: string;
  profileImageUrl: string;
  contactType?: any;
}

export interface SkillList {
  skillId: string;
  skillName: string;
  description: string;
  imageUrl: string;
  relatedJobGroups: string[];
  relatedJobs: string[];
  relatedJobGroupNames: string[];
  relatedJobNames: string[];
  relatedLevels: number[];
  trendLevel: number;
  activeLevel: number;
  createdAt?: any;
  updatedAt?: any;
  // name: string;
  // year: string;
  // categoryName: string;
  // dayName: string;
  // startTime?: any;
  // endTime?: any;
  // id: number;
  // content: string;
  // trackOrder: number;
  // videoUrl: string;
  // slideUrl: string;
  // type: string;
  // liveUrl: string;
  // mainCategory: string;
  // categoryCodeList: number[];
  // speakerList: SpeakerList[];
}
