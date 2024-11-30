import { axiosGeneralAPI } from '../index';

// 직무 조회
export async function getJobs() {
  const { data } = await axiosGeneralAPI().get('/jobs');
  return data;
}

// 퀴즈 조회
export const getQuizList = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/quizzes', { params });
  return data.data;
};

// 내 퀴즈 조회
export const getMyQuiz = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/my/quizzes', { params });
  return data.data;
};
// 내 퀴즈 조회
export const getMyQuizContents = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/my/contents', { params });
  return data.data;
};
// 내 퀴즈 조회
export const getMyQuizThresh = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/my/quizzes/trashbin', { params });
  return data.data;
};
// 내 퀴즈 조회
export const getGetSchedule = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/club/quiz-schedule', { params });
  return data.data;
};

// 내 퀴즈 조회
export const getGetQuizSchedule = async params => {
  const { data } = await axiosGeneralAPI().post(`/api/v2/quiz-clubs/${params.clubId}/schedules`, {
    studyCycle: [params.studyCycle], // Ensure studyCycle is sent as an array
    studyCount: params.studyCount,
    startDate: params.startDate,
    endDate: params.endDate,
    clubQuizzes: params.clubQuizzes.map(quiz => ({
      quizSequence: quiz.quizSequence,
      publishDate: quiz.publishDate,
    })), // Format clubQuizzes correctly
  });
  return data.data;
};
export const getGetScheduleDay = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/club/schedules', { params });
  return data.data;
};

// 임시저장 조회
export async function getGetTemp() {
  const { data } = await axiosGeneralAPI().get('/api/v2/quiz-club/temporary');
  return data.data;
}

// 임시저장 조회
export async function getLectureGetTemp() {
  const { data } = await axiosGeneralAPI().get('/api/v1/lecture-club/temporary');
  return data.data;
}

// 내 댓글 조회
export const getMyQuizReply = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/replies/me', { params });
  return data.data;
};

// 퀴즈 댓글 조회
export const getQuizReply = async params => {
  const { data } = await axiosGeneralAPI().get('/api/v1/reply', { params });
  return data.data;
};
