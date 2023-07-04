export interface ExperienceListResponse {
  [key: string]: any;
  data: {
    data: ExperienceList[];
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

export interface ExperienceList {
  experienceId: string;
  experienceName: string;
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
