export interface EvaluationScores {
  understanding: number;
  diligence: number;
  criticalThinking: number;
  completion: number;
  participation: number;
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

export interface AIFeedbackSummaryProps {
  aiFeedbackDataTotal?: AIFeedbackDataTotal;
  aiFeedbackDataTotalQuiz?: AIFeedbackDataTotalQuiz;
  isLoading?: boolean;
  isFeedbackOptions?: boolean;
  isAdmin?: boolean;
  clubSequence?: string;
  memberUUID?: string;
}
