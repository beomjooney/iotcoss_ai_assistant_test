// Monthly 공통
export interface MonthlyRsponse {
  responseCode?: string;
  message?: string;
}

// monthly/ranking
export interface MonthlyRankingResponse extends MonthlyRsponse {
  data: MonthlyRankingData[];
}

export interface MonthlyRankingData {
  maker: maker[];
  quizzes: quizzes[];
  clubs: clubs[];
}

interface maker {
  nickname: string;
  profileImageUrl: string;
  madeQuizCount: number;
  receivedLikeCount: number;
  quizzes: quizzes[];
}

interface quizzes {
  quizSequence: number;
  content: string;
  answerCount: number;
  likeCount: number;
  activeCount: number;
}

interface clubs {
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
  data: MonthlyQuizzesData[];
}

export interface MonthlyQuizzesData {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  contents: MonthlyQuizzesContents[];
}

interface MonthlyQuizzesContents {
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

interface MonthlyMakerContents {
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
  data: maker[];
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

interface MonthlyClubContents {
  statType: string;
  statDate: number;
  clubRank: number;
  clubSequence: number;
  clubRunRate: number;
}
