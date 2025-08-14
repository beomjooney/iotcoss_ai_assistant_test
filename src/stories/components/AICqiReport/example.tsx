import React from 'react';
import AICqiReport from './index';
import { LectureAnalysisData } from './types';

// 제공된 JSON 데이터를 기반으로 한 예제 데이터
const exampleData: LectureAnalysisData = {
  studentFeedback:
    "학생들은 주로 웹 개발에 대한 실질적인 적용 사례와 기초적인 기술 스택에 대한 이해를 요구하고 있습니다. 특히, HTML, CSS, JavaScript 같은 기초 기술 스택에 대한 언급이 많았으며, 이들 기술이 어떻게 협업과 응용에 적용될 수 있는지를 깊이 있게 알고 싶어하는 경향이 우세합니다. 예를 들어, 많은 학생들이 '웹 개발을 배우는 주요 이유는 무엇인가요?'라는 질문을 통해 웹 개발이 현대 사회에서 왜 중요한 기술인지에 대한 이해를 원했습니다. 이와 관련해, 학생들은 UX/UI 디자인, 데이터베이스와의 상호작용, 동적 웹 페이지 생성 등 이론과 실습 다방면에서 관심을 나타내었으며, 질문의 60% 이상이 실습이나 프로젝트에 대한 구체적인 예시 요청이었습니다. 초기 요구사항 분석에 따르면, 학생들은 실습을 통해 기술을 배워야 한다고 느끼고 있으며, 특히 이론적인 설명보다 실습 중심의 학습을 선호하고 있음을 확인할 수 있습니다.",
  studentFeedbackOnLectureContent:
    '강의 자료에 대한 학생들의 피드백을 분석해보면, 주요 어려운 주제로는 DNS 및 서버 구조 관련 개념들이 자주 등장하였습니다. 학생들이 특히 뜨거운 관심을 보인 자료는 API와 웹 서버의 작동 방식에 대한 내용으로, 이와 관련된 질문 빈도가 25%를 차지하고 있습니다. 반면, HTML과 CSS의 기본적인 이해도는 높았으며, 이와 관련된 질문들은 상대적으로 적었습니다. 분석에 따르면, 보충 설명이 필요한 부분은 주로 웹 서버와 어플리케이션 서버 간의 차이점이며, 이 내용은 학생들이 이해하기 어려워하는 주제로 확인되었습니다. 또한, 자료의 난이도는 사용자 수준에 적합하지만, 예시와 그림 등을 더 보충하면 보다 효과적일 것이라고 판단됩니다. 시각 자료와 실습의 비율을 높이는 방향으로 개선이 필요합니다.',
  studentAiInteractionCount: 132,
  lectureQuestion: {
    totalQuestionCount: 128,
    aiAnsweredQuestionCount: 120,
    instructorAnsweredQuestionCount: 0,
  },
  aiUsage: {
    total: 5,
    aiUsedStudentCount: 5,
    aiNotUsedStudentCount: 0,
  },
  answerType: {
    total: 120,
    lectureContentBasedAnswerCount: 116,
    generalKnowledgeBasedAnswerCount: 4,
  },
  questionAnswered: {
    askedQuestionCountAverage: 25.6,
    answeredQuestionCountAverage: 0.91,
  },
  studentAskedQuestionSummary:
    "학생들의 주요 질문을 분석한 결과, 질문은 세 가지 주요 주제로 크게 나뉘었습니다. 첫째로, 웹 개발 기초와 관련된 질문이 전체 질문의 약 30%를 차지하였고, API와 데이터베이스 관련 질문이 25%, 아키텍처 관련 질문은 20%였습니다. 가장 빈번한 질문으로는 '웹 서버(WS)와 웹 어플리케이션 서버(WAS)의 차이는 무엇인가요?'가 있으며, 학생들이 실제로 접하며 궁금해하는 기초적인 주제였습니다. 둘째, 'REST API와 GraphQL의 차이점은 무엇인가요?'와 같은 심화 적용에 대한 질문도 증가하고 있습니다. 기초 개념 질문 비율이 약 70%를 차지하는 반면, 심화 응용 질문은 30%로, 이는 학생들의 선행 지식이 부족함을 시사합니다. 주목할만한 질문으로는 'API Gateway의 역할은 무엇인가요?'가 있으며, 이는 학생이 개념을 잘 이해하고 있으며, 실무와의 연결성을 볼 수 있는 질문입니다.",
  lectureContentImprovementFeedback:
    '수업 개선을 위한 단기 방안으로는 먼저, 웹 서버와 웹 어플리케이션 서버의 차이와 DNS 개념에 대한 보충 설명을 시각 자료와 함께 제시할 필요가 있습니다. 둘째, 특정 주요 개념에 대한 실습 세션을 강화하여 학생들이 직접적으로 체감할 수 있는 기회를 제공하는 것이 중요합니다. 마지막으로, API Gateway와 관련된 실습 예제를 추가하여 실제 발생 가능한 시나리오를 대비할 수 있는 기회를 마련해야 합니다. 중장기적 개선 방향으로는, 수업 자료 형식을 다변화하여 동영상이나 인터랙티브 콘텐츠를 통해 학생들의 관심을 끌 수 있는 방안을 고려해야 하고, 종합적인 평가 방식에 대한 변화를 도입하여 학생들의 개별적인 성장을 측정할 수 있는 방법을 개발해야 합니다. 각 제안들은 즉각적인 수업 적용이 가능하며, 자료는 정기적으로 업데이트하여 최적의 학습 효과를 위해 지속적으로 관리해야 합니다.',
};

// 예제 컴포넌트
const AICqiReportExample: React.FC = () => {
  return (
    <div className="tw-p-6 tw-max-w-6xl tw-mx-auto">
      <h1 className="tw-text-2xl tw-font-bold tw-mb-6">AI 강의 분석 리포트 예제</h1>
      <AICqiReport
        lectureAnalysisData={exampleData}
        isLoading={false}
        isFeedbackOptions={false}
        isAdmin={false}
        isTotalFeedback={true}
      />
    </div>
  );
};

export default AICqiReportExample;
