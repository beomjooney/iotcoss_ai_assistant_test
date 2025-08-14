export interface EvaluationScores {
  understanding: number;
  diligence: number;
  criticalThinking: number;
  completion: number;
  participation: number;
  selfDirectedLearning?: number;
}

export interface TotalScore {
  average: number;
  myScore: number;
}

export interface FeedbackData {
  overallFeedback: string;
  strengths: string;
  weaknesses: string;
  improvePoints: string;
}

export interface Resource {
  title: string;
  url: string;
}

export interface Recommendation {
  recommendation: string;
  resources: Resource[];
}

export interface AIFeedbackDataTotal {
  myEvaluationScores: EvaluationScores;
  averageEvaluationScores: EvaluationScores;
  totalScore: TotalScore;
  feedback: FeedbackData;
  recommendations: Recommendation[];
  instructorOverallFeedback?: string;
}

export interface QuizFeedbackItem {
  order: number;
  publishDate: string;
  question: string;
  grading: number;
  summaryFeedback: string;
}

export interface AIFeedbackDataTotalQuiz {
  contents: QuizFeedbackItem[];
}

// 새로운 강의 분석 데이터 타입 정의
export interface LectureQuestion {
  totalQuestionCount: number;
  aiAnsweredQuestionCount: number;
  instructorAnsweredQuestionCount: number;
}

export interface AiUsage {
  total: number;
  aiUsedStudentCount: number;
  aiNotUsedStudentCount: number;
}

export interface AnswerType {
  total: number;
  lectureContentBasedAnswerCount: number;
  generalKnowledgeBasedAnswerCount: number;
}

export interface QuestionAnswered {
  askedQuestionCountAverage: number;
  answeredQuestionCountAverage: number;
}

export interface LectureAnalysisData {
  studentFeedback: string;
  studentFeedbackOnLectureContent: string;
  studentAiInteractionCount: number;
  lectureQuestion: LectureQuestion;
  aiUsage: AiUsage;
  answerType: AnswerType;
  questionAnswered: QuestionAnswered;
  studentAskedQuestionSummary: string;
  lectureContentImprovementFeedback: string;
}

export interface AICqiReportProps {
  aiFeedbackDataTotal?: AIFeedbackDataTotal;
  aiFeedbackDataTotalQuiz?: AIFeedbackDataTotalQuiz;
  lectureAnalysisData?: LectureAnalysisData;
  isLoading?: boolean;
  isFeedbackOptions?: boolean;
  isAdmin?: boolean;
  clubSequence?: string;
  memberUUID?: string;
  isTotalFeedback?: boolean;
}
