// Monthly 공통
export interface MonthlyRsponse {
  responseCode?: string;
  message?: string;
}

// monthly/ranking
export interface MonthlyRankingResponse extends MonthlyRsponse {
  maker: Maker;
  quizzes: Quizzes[];
  clubs: Clubs;
}

export interface Maker {
  nickname: string;
  profileImageUrl: string;
  introductionMessage: string;
  jobGroupType: string;
  jobGroupTypeName: string;
  jobType: string;
  jobTypeName: string;
  madeQuizCount: number;
  receivedLikeCount: number;
  experienceYears: number;
  levelType: number;
  customSkills: string[];
  quizzes: Quizzes[];
}

export interface Quizzes {
  quizSequence: number;
  content: string;
  answerCount: number;
  likeCount: number;
  activeCount: number;
  recommendJobGroups: string[];
  recommendJobGroupNames: string[];
  recommendJobs: string[];
  recommendJobNames: string[];
  recommendLevels: string[];
}

export interface Clubs {
  clubSequence: number;
  clubName: string;
  clubLeaderNickname: string;
  clubImageUrl: string;
  averageProgressPercentage: number;
  recommendJobNames: string[];
  recommendJobs: string[];
}

// monthly/quizzes
export interface MonthlyQuizzesResponse extends MonthlyRsponse {
  data: MonthlyQuizzesData;
}

export interface MonthlyQuizzesData {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  contents: MonthlyQuizzesContents;
}

export interface MonthlyQuizzesContents {
  statType: string;
  statDate: number;
  quizRank: number;
  quizSequence: number;
  answerCount: number;
}

// monthly/maker
export interface MonthlyMakerResponse extends MonthlyRsponse {
  data: MonthlyMakerData[];
}

export interface MonthlyMakerData {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  contents: MonthlyMakerContents[];
}

export interface MonthlyMakerContents {
  statType: string;
  statDate: number;
  makerRank: number;
  memberUUID: string;
  madeQuizCount: number;
}

// monthly/maker/quizzes
export interface MonthlyMakerQuizzesResponse extends MonthlyRsponse {
  data: MonthlyMakerQuizzesData[];
}

export interface MonthlyMakerQuizzesData {
  data: Maker;
}

// monthly/clubs
export interface MonthlyClubsResponse extends MonthlyRsponse {
  data: MonthlyClubData[];
}

export interface MonthlyClubData {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  contents: MonthlyClubContents[];
}

export interface MonthlyClubContents {
  statType: string;
  statDate: number;
  clubRank: number;
  clubSequence: number;
  clubRunRate: number;
}

// quizzes/{quizSequence}/answers
export interface QuizzesAnswersResponse extends MonthlyRsponse {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  contents: QuizzesAnswers[];
}

export interface QuizzesAnswers {
  clubQuizAnswerSequence: number;
  clubQuizSequence: number;
  nickname: string;
  profileImageUrl: string;
  answerStatus: string;
  preAnswer: string;
  postAnswer: string;
  likeCount: number;
  replyCount: number;
  onePickCount: number;
  createdAt: string;
  isLiked: boolean;
  isOnePicked: boolean;
}

// answers/{quizAnswersSequence}/replies
export interface AnswerRepliesResponse extends MonthlyRsponse {
  data: ReplisesData;
}

export interface ReplisesData {
  answer: AnswerData;
  clubQuizReplies: ClubQuizReplies;
}

export interface AnswerData {
  clubQuizAnswerSequence: number;
  clubQuizSequence: number;
  likeCount: number;
  replyCount: number;
  onePickCount: number;
  nickname: string;
  profileImageUrl: string;
  answerStatus: string;
  preAnswer: string;
  postAnswer: string;
  createdAt: string;
}

export interface ClubQuizReplies {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  contents: ClubQuizRepliesContents[];
}

export interface ClubQuizRepliesContents {
  sequence: number;
  clubQuizAnswerSequence: number;
  parentReplySequence: number;
  nickname: string;
  imageUrl: string;
  createAt: string;
  body: string;
  postReplyStatus: string;
  replies: string[];
}
