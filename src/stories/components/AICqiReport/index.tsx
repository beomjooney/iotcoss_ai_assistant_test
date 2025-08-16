import React, { useEffect, useState } from 'react';
import { AICqiReportProps } from './types';
import dynamic from 'next/dynamic';
import Loading from 'src/stories/components/Loading';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AICqiReport: React.FC<AICqiReportProps> = ({ aiFeedbackDataTotal, isLoading = false }) => {
  // AI 사용 현황 데이터를 차트용으로 변환
  const aiUsageData = [
    {
      name: '활용 학생',
      value: aiFeedbackDataTotal?.aiUsage?.aiUsedStudentCount,
      color: '#3B82F6', // blue-500
    },
    {
      name: '미활용 학생',
      value: aiFeedbackDataTotal?.aiUsage?.aiNotUsedStudentCount,
      color: '#d7d7d7', // red-500 - 더 뚜렷한 빨간색으로 변경
    },
  ];

  const answerTypeData = [
    { category: '연관 질문', count: aiFeedbackDataTotal?.answerType?.lectureContentBasedAnswerCount, color: '#3B82F6' },
    {
      category: '미연관 질문',
      count: aiFeedbackDataTotal?.answerType?.generalKnowledgeBasedAnswerCount,
      color: '#FF6969',
    },
  ];

  const questionData = [
    { category: '전체 질의', count: aiFeedbackDataTotal?.lectureQuestion?.totalQuestionCount, color: '#06b6d4' },
    { category: 'AI조교 답변', count: aiFeedbackDataTotal?.lectureQuestion?.aiAnsweredQuestionCount, color: '#3b82f6' },
    {
      category: '교수자 답변',
      count: aiFeedbackDataTotal?.lectureQuestion?.instructorAnsweredQuestionCount,
      color: '#1e40af',
    },
  ];

  // 강의 분석 데이터가 있는 경우의 렌더링 함수
  const renderLectureAnalysis = () => {
    return (
      <div className="tw-max-w-7xl tw-mx-auto tw-space-y-8 tw-pb-10">
        {/* Header Section */}
        <div className="tw-space-y-4">
          <div className="tw-text-xl tw-font-bold tw-text-gray-900">학기 중 학생들의 평가 및 의견</div>
          <div className="tw-bg-blue-50 tw-border-l-4 tw-border-blue-400 tw-p-4 tw-rounded-r-lg">
            <p className="tw-text-gray-700 tw-leading-relaxed">{aiFeedbackDataTotal?.studentFeedback}</p>
          </div>
        </div>
        {/* Course Materials Opinion Section */}
        <div className="tw-space-y-4">
          <div className="tw-text-xl tw-font-semibold tw-text-gray-800">수업자료에 대한 학생들 의견</div>
          <div className="tw-bg-gray-50 tw-p-4 tw-rounded-lg">
            <p className="tw-text-gray-700 tw-leading-relaxed">
              {aiFeedbackDataTotal?.studentFeedbackOnLectureContent}
            </p>
          </div>
        </div>
        {/* Key Metrics */}
        <div className="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-4">
          AI조교 활용 학생 상호작용:{' '}
          <span className="tw-text-blue-600">{aiFeedbackDataTotal?.studentAiInteractionCount}건</span>
        </div>
        {/* Charts Grid */}
        <div className="tw-grid tw-grid-cols-2 tw-lg:tw-grid-cols-2 tw-gap-6">
          {/* Question Statistics Bar Chart */}
          <div className="tw-bg-white tw-rounded-lg border tw-shadow-sm">
            <div className="tw-p-6 tw-pb-4">
              <div className="tw-text-lg tw-font-semibold tw-text-gray-800">강의자료 질의/답변 수</div>
            </div>
            <div className="tw-px-6 tw-pb-6">
              <div className="tw-space-y-4">
                {questionData.map((item, index) => (
                  <div key={index} className="tw-grid tw-grid-cols-10 tw-gap-4 tw-items-center">
                    {/* 왼쪽: 20% (2/10) - 카테고리 레이블 */}
                    <div className="tw-col-span-3 tw-flex tw-items-center tw-space-x-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <span className="tw-text-base tw-text-gray-600">{item.category}</span>
                    </div>

                    {/* 중간: 70% (7/10) - 차트 바 */}
                    <div className="tw-col-span-5">
                      <div
                        className="tw-h-4"
                        style={{
                          backgroundColor: item.color,
                          width: `${(item.count / 300) * 100}%`,
                        }}
                      />
                    </div>

                    {/* 끝: 10% (1/10) - 수치 */}
                    <div className="tw-col-span-2 tw-text-right">
                      <span className="tw-text-base tw-font-medium tw-text-gray-900">{item.count}건</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Usage Pie Chart */}
          <div className="tw-bg-white tw-rounded-lg border tw-shadow-sm">
            <div className="tw-p-6 tw-pb-4">
              <div className="tw-text-lg tw-font-semibold tw-text-gray-800">AI조교 활용 학생 수</div>
            </div>
            <div className="tw-px-6 tw-pb-6">
              <div className="tw-grid tw-grid-cols-2 tw-gap-6 tw-items-end">
                {/* Labels - Right Side */}
                <div className="tw-space-y-3">
                  {aiUsageData.map((item, index) => (
                    <div key={index} className="tw-flex tw-items-center tw-justify-between">
                      <div className="tw-flex tw-items-center tw-space-x-2">
                        <div className="tw-w-3 tw-h-3 tw-rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="tw-text-base tw-text-gray-600">{item.name}</span>
                      </div>
                      <span className="tw-text-base tw-font-medium">{item.value}명</span>
                    </div>
                  ))}
                </div>
                {/* Pie Chart - Left Side */}
                <div className="tw-flex tw-items-center tw-justify-center">
                  <div className="tw-relative tw-w-[150px] tw-h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={aiUsageData} cx="50%" cy="50%" innerRadius={50} outerRadius={65} dataKey="value">
                          {aiUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
                      <div className="tw-text-center">
                        <div className="tw-text-lg tw-font-semibold tw-text-gray-900">
                          총 {aiFeedbackDataTotal?.aiUsage?.total}명
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Info Pie Chart */}
          <div className="tw-bg-white tw-rounded-lg border tw-shadow-sm">
            <div className="tw-p-6 tw-pb-4">
              <div className="tw-text-lg tw-font-semibold tw-text-gray-800">답변 유형 비율</div>
            </div>
            <div className="tw-px-6 tw-pb-6">
              <div className="tw-grid tw-grid-cols-2 tw-gap-6 tw-items-end">
                {/* Labels - Right Side */}
                <div className="tw-space-y-3">
                  {answerTypeData.map((item, index) => (
                    <div key={index} className="tw-flex tw-items-center tw-justify-between">
                      <div className="tw-flex tw-items-center tw-space-x-2">
                        <div className="tw-w-3 tw-h-3 tw-rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="tw-text-base tw-text-gray-600">{item.category}</span>
                      </div>
                      <span className="tw-text-base tw-font-medium">{item.count}명</span>
                    </div>
                  ))}
                </div>
                {/* Pie Chart - Left Side */}
                <div className="tw-flex tw-items-center tw-justify-center">
                  <div className="tw-relative tw-w-[150px] tw-h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={answerTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={65} dataKey="count">
                          {answerTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
                      <div className="tw-text-center">
                        <div className="tw-text-lg tw-font-semibold tw-text-gray-900">
                          총 {aiFeedbackDataTotal?.answerType?.total}명
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Average Statistics */}
          <div className="tw-bg-white tw-rounded-lg border tw-shadow-sm">
            <div className="tw-p-6 tw-pb-4">
              <div className="tw-text-lg tw-font-semibold tw-text-gray-800">질의 응답성</div>
            </div>
            <div className="tw-px-6 tw-pb-6">
              <div className="tw-grid tw-grid-cols-2 tw-gap-8">
                <div className="text-center">
                  <div className="tw-text-base tw-text-gray-500 tw-mb-3">평균 질의</div>
                  <div className="tw-flex tw-items-end tw-justify-center tw-gap-2">
                    <div className="tw-text-5xl tw-font-bold tw-text-cyan-500">
                      {aiFeedbackDataTotal?.questionAnswered?.askedQuestionCountAverage}
                    </div>
                    <div className="tw-text-sm tw-text-gray-500">건</div>
                  </div>
                </div>
                <div className="tw-text-center">
                  <div className="tw-text-base tw-text-gray-500 tw-mb-3">평균 답변</div>
                  <div className="tw-flex tw-items-end tw-justify-center tw-gap-2">
                    <div className="tw-text-5xl tw-font-bold tw-text-blue-600">
                      {aiFeedbackDataTotal?.questionAnswered?.answeredQuestionCountAverage}
                    </div>
                    <div className="tw-text-sm tw-text-gray-500">건</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Student Questions Summary */}
        <div className="tw-bg-white tw-rounded-lg border tw-shadow-sm">
          <div className="tw-p-6 tw-pb-4">
            <div className="tw-text-xl tw-font-semibold tw-text-gray-800">학생 주요 질문 요약</div>
          </div>
          <div className="tw-px-6 tw-pb-6">
            <div className="tw-prose tw-max-w-none">
              <p className="tw-text-gray-700 tw-leading-relaxed">{aiFeedbackDataTotal?.studentAskedQuestionSummary}</p>
            </div>
          </div>
        </div>
        {/* Improvement Suggestions */}
        <div className="tw-bg-white tw-rounded-lg border tw-shadow-sm">
          <div className="tw-p-6 tw-pb-4">
            <div className="tw-text-xl tw-font-semibold tw-text-gray-800">강의자료 개선사항에 대한 의견</div>
          </div>
          <div className="tw-px-6 tw-pb-6">
            <div className="tw-prose tw-max-w-none">
              <p className="tw-text-gray-700 tw-leading-relaxed">
                {aiFeedbackDataTotal?.lectureContentImprovementFeedback}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tw-max-h-[80vh] tw-pb-20">
      {isLoading && (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-[400px] tw-h-full tw-gap-4">
          <div className="tw-relative">
            <Loading />
            <p className="tw-text-gray-600 tw-text-base tw-font-medium tw-text-center">
              CQI 리포트를 불러오는 중입니다...
              <br />
              30~60초 소요됩니다.
            </p>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="">
          {(() => {
            // 객체가 존재하고 실제 데이터가 있는지 확인
            const hasValidData =
              aiFeedbackDataTotal &&
              Object.keys(aiFeedbackDataTotal).length > 0 &&
              (aiFeedbackDataTotal.studentFeedback || aiFeedbackDataTotal.aiUsage || aiFeedbackDataTotal.answerType);

            if (hasValidData) {
              return renderLectureAnalysis();
            }

            return (
              <div>
                <p className="tw-text-lg tw-text-center tw-text-gray-500 tw-h-[600px] tw-flex tw-items-center tw-justify-center">
                  CQI 보고서를 생성하려면 <br />
                  CQI 보고서 AI초안생성 버튼을 눌러주세요.
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default AICqiReport;
