import React, { useEffect, useState } from 'react';
import { AIFeedbackSummaryProps } from './types';
import dynamic from 'next/dynamic';
import Loading from 'src/stories/components/Loading';
import { useLectureClubFeedbackSave } from 'src/services/community/community.mutations';

// ReactApexChart를 동적으로 import하여 SSR 비활성화
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AIFeedbackSummary: React.FC<AIFeedbackSummaryProps> = ({
  aiFeedbackDataTotal,
  aiFeedbackDataTotalQuiz,
  isLoading = false,
  isFeedbackOptions = false,
  isAdmin = false,
  clubSequence = '',
  memberUUID = '',
}) => {
  console.log('aiFeedbackDataTotal', aiFeedbackDataTotal);

  const {
    mutate: onLectureClubFeedbackSave,
    isSuccess: lectureClubFeedbackSaveSucces,
    isError: lectureClubFeedbackSaveError,
  } = useLectureClubFeedbackSave();

  useEffect(() => {
    if (lectureClubFeedbackSaveSucces) {
      alert('피드백 저장 완료');
    }
  }, [lectureClubFeedbackSaveSucces]);

  useEffect(() => {
    if (lectureClubFeedbackSaveError) {
      alert('피드백 저장 실패');
    }
  }, [lectureClubFeedbackSaveError]);

  useEffect(() => {
    if (aiFeedbackDataTotal) {
      setFeedback(aiFeedbackDataTotal?.instructorOverallFeedback || '');
    }
  }, [aiFeedbackDataTotal]);

  const [feedback, setFeedback] = useState<string>(`${aiFeedbackDataTotal?.instructorOverallFeedback || ''}`);

  return (
    <div className="tw-max-h-[80vh]  tw-pb-20">
      {/* 전체 퀴즈 총평 피드백 */}
      {isLoading && (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-[400px] tw-h-full tw-gap-4">
          <div className="tw-relative">
            <Loading />
            <p className="tw-text-gray-600 tw-text-base tw-font-medium tw-text-center">
              총평 피드백을 불러오는 중입니다...
              <br />
              30~60초 소요됩니다.
            </p>
          </div>
        </div>
      )}
      {!isLoading && (
        <div className="border tw-border-gray-200 tw-rounded-lg tw-p-4">
          {aiFeedbackDataTotal !== null ? (
            <div>
              <div className="tw-flex tw-items-center tw-mb-4">
                <div className="tw-w-8 tw-h-8 tw-bg-blue-500 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-3">
                  <span className="tw-text-white tw-text-sm tw-font-bold">AI</span>
                </div>
                <div className="tw-flex tw-items-center tw-gap-2">
                  <p className="tw-text-base tw-font-bold tw-text-black">AI피드백</p>
                </div>
              </div>

              <div className="tw-text-blue-600 tw-text-base tw-mb-4 tw-font-bold tw-cursor-pointer">학습자 분석</div>

              {/* 학습자 분석 차트 영역 */}
              <div className="tw-p-6 tw-rounded-lg tw-mb-6">
                <div className="tw-grid tw-gap-6" style={{ gridTemplateColumns: '55% 45%' }}>
                  {/* 레이더 차트 영역 (간단한 표현) */}
                  <div className="tw-relative tw-flex tw-items-center tw-justify-center">
                    {/* 레이더 차트 컨테이너 */}
                    <div className="tw-w-full tw-h-full">
                      {typeof window !== 'undefined' && (
                        <ReactApexChart
                          options={{
                            chart: {
                              type: 'radar',
                              toolbar: {
                                show: false,
                              },
                              background: 'transparent',
                            },
                            colors: ['#3B82F6', '#F59E0B'],
                            fill: {
                              type: 'solid',
                              opacity: [0.6, 0.3],
                            },
                            stroke: {
                              width: [2, 2],
                              dashArray: [0, 5],
                            },
                            markers: {
                              size: [4, 4],
                            },
                            xaxis: {
                              categories: [
                                '이해도 ',
                                '성실도 ',
                                '사고도 ',
                                aiFeedbackDataTotal?.myEvaluationScores?.selfDirectedLearning
                                  ? '자기주도학습능력'
                                  : aiFeedbackDataTotal?.myEvaluationScores?.completion
                                  ? '완성도 '
                                  : '자기주도학습능력',
                                '참여도 ',
                              ],
                              labels: {
                                style: {
                                  colors: '#374151',
                                  fontSize: '12px',
                                  fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
                                  fontWeight: 500,
                                },
                              },
                            },
                            yaxis: {
                              show: false,
                              min: 0,
                              max: 100,
                            },
                            grid: {
                              show: false,
                            },
                            plotOptions: {
                              radar: {
                                size: 120,
                                polygons: {
                                  fill: {
                                    colors: ['transparent'],
                                  },
                                },
                              },
                            },
                            dataLabels: {
                              enabled: false,
                            },
                            legend: {
                              show: true,
                              position: 'bottom',
                              horizontalAlign: 'center',
                              fontSize: '12px',
                              fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
                            },
                          }}
                          series={[
                            {
                              name: '내 점수',
                              data: [
                                aiFeedbackDataTotal?.myEvaluationScores?.understanding || 0,
                                aiFeedbackDataTotal?.myEvaluationScores?.diligence || 0,
                                aiFeedbackDataTotal?.myEvaluationScores?.criticalThinking || 0,
                                // selfDirectedLearning 값이 있으면 그 값을, 아니면 completion 값을 사용
                                aiFeedbackDataTotal?.myEvaluationScores?.selfDirectedLearning ??
                                  aiFeedbackDataTotal?.myEvaluationScores?.completion ??
                                  0,
                                aiFeedbackDataTotal?.myEvaluationScores?.participation || 0,
                              ], // 이해도, 성실도, 사고도, 자기주도학습능력(없으면 완성도), 참여도
                            },
                            {
                              name: '평균 점수',
                              data: [
                                aiFeedbackDataTotal?.averageEvaluationScores?.understanding || 0,
                                aiFeedbackDataTotal?.averageEvaluationScores?.diligence || 0,
                                aiFeedbackDataTotal?.averageEvaluationScores?.criticalThinking || 0,
                                // selfDirectedLearning 값이 있으면 그 값을, 아니면 completion 값을 사용
                                aiFeedbackDataTotal?.averageEvaluationScores?.selfDirectedLearning ??
                                  aiFeedbackDataTotal?.averageEvaluationScores?.completion ??
                                  0,
                                aiFeedbackDataTotal?.averageEvaluationScores?.participation || 0,
                              ], // 비교군 데이터 (점선)
                            },
                          ]}
                          type="radar"
                          width="100%"
                          height="100%"
                        />
                      )}
                    </div>
                  </div>

                  {/* 상세 점수 */}
                  <div className="tw-space-y-3">
                    <div className="tw-text-base tw-font-bold tw-text-black tw-mb-4">상세 항목</div>

                    <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                      <span className="tw-text-sm tw-text-gray-700 tw-w-16">이해도</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                          <div
                            className="tw-h-full tw-bg-black tw-rounded-full tw-transition-all tw-duration-300"
                            style={{ width: `${aiFeedbackDataTotal?.myEvaluationScores?.understanding || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-font-medium">
                          {aiFeedbackDataTotal?.myEvaluationScores?.understanding || 0}/100
                        </span>
                      </div>
                    </div>

                    <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                      <span className="tw-text-sm tw-text-gray-700 tw-w-16">사고도</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                          <div
                            className="tw-h-full tw-bg-black tw-rounded-full tw-transition-all tw-duration-300"
                            style={{ width: `${aiFeedbackDataTotal?.myEvaluationScores?.criticalThinking || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-font-medium">
                          {aiFeedbackDataTotal?.myEvaluationScores?.criticalThinking || 0}/100
                        </span>
                      </div>
                    </div>

                    <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                      <span className="tw-text-sm tw-text-gray-700 tw-w-16">성실도</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                          <div
                            className="tw-h-full tw-bg-black tw-rounded-full tw-transition-all tw-duration-300"
                            style={{ width: `${aiFeedbackDataTotal?.myEvaluationScores?.diligence || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-font-medium">
                          {aiFeedbackDataTotal?.myEvaluationScores?.diligence || 0}/100
                        </span>
                      </div>
                    </div>

                    <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                      <span className="tw-text-sm tw-text-gray-700 tw-w-16">참여도</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                          <div
                            className="tw-h-full tw-bg-black tw-rounded-full tw-transition-all tw-duration-300"
                            style={{ width: `${aiFeedbackDataTotal?.myEvaluationScores?.participation || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-font-medium">
                          {aiFeedbackDataTotal?.myEvaluationScores?.participation || 0}/100
                        </span>
                      </div>
                    </div>

                    {aiFeedbackDataTotal?.myEvaluationScores?.completion !== undefined && (
                      <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                        <span className="tw-text-sm tw-text-gray-700 tw-w-16">완성도</span>
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                            <div
                              className="tw-h-full tw-bg-black tw-rounded-full tw-transition-all tw-duration-300"
                              style={{ width: `${aiFeedbackDataTotal?.myEvaluationScores?.completion || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <span className="tw-text-sm tw-font-medium">
                            {aiFeedbackDataTotal?.myEvaluationScores?.completion || 0}/100
                          </span>
                        </div>
                      </div>
                    )}

                    {aiFeedbackDataTotal?.myEvaluationScores?.selfDirectedLearning !== undefined && (
                      <div className="tw-flex tw-justify-between tw-items-center tw-px-5">
                        <span className="tw-text-sm tw-text-gray-700 tw-w-16">
                          자기주도
                          <br />
                          학습능력
                        </span>
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                            <div
                              className="tw-h-full tw-bg-black tw-rounded-full tw-transition-all tw-duration-300"
                              style={{
                                width: `${aiFeedbackDataTotal?.myEvaluationScores?.selfDirectedLearning ?? 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <span className="tw-text-sm tw-font-medium">
                            {aiFeedbackDataTotal?.myEvaluationScores?.selfDirectedLearning ?? 0}/100
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="tw-mt-4 tw-pt-3 tw-border-t tw-border-gray-200">
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-base tw-font-bold tw-text-black">총점</span>
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <div className="tw-text-sm tw-text-gray-600">학과 평균점수 : </div>
                          <div className="tw-text-sm tw-text-gray-600">
                            {aiFeedbackDataTotal?.totalScore?.average || 0}/5
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tw-flex tw-justify-between tw-items-center border-white tw-rounded-full tw-p-5 tw-bg-[#F3F9FF]">
                      <span className="tw-text-sm tw-font-bold tw-text-gray-700">내 점수</span>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <div className="tw-w-40 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                          <div
                            className="tw-h-full tw-bg-blue-500 tw-rounded-full tw-transition-all tw-duration-300"
                            style={{ width: `${((aiFeedbackDataTotal?.totalScore?.myScore || 0) / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-font-medium">
                          {aiFeedbackDataTotal?.totalScore?.myScore || 0}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 학습 총평 피드백 */}
              <div className="tw-mb-6">
                <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">학습 총평 피드백</div>
                <div className="tw-rounded-lg">
                  <p className="tw-text-base tw-text-gray-700 tw-leading-relaxed">
                    {aiFeedbackDataTotal?.feedback?.overallFeedback || '피드백 요약이 없습니다.'}
                  </p>
                </div>
              </div>

              {/* 강점 */}
              <div className="tw-mb-6">
                <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">강점</div>
                <div className="tw-space-y-2">
                  <p className="tw-text-base tw-text-gray-700">
                    {aiFeedbackDataTotal?.feedback?.strengths.length > 0
                      ? aiFeedbackDataTotal?.feedback?.strengths
                      : '강점이 없습니다.'}
                  </p>
                </div>
              </div>

              {/* 약점 */}
              <div className="tw-mb-6">
                <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">약점</div>
                <div className="tw-space-y-2">
                  <p className="tw-text-base tw-text-gray-700">
                    {aiFeedbackDataTotal?.feedback?.weaknesses.length > 0
                      ? aiFeedbackDataTotal?.feedback?.weaknesses
                      : '약점이 없습니다.'}
                  </p>
                </div>
              </div>

              {/* 개선 */}
              <div className="tw-mb-6">
                <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">개선</div>
                <div className="tw-space-y-2">
                  <p className="tw-text-base tw-text-gray-700">
                    {aiFeedbackDataTotal?.feedback?.improvePoints.length > 0
                      ? aiFeedbackDataTotal?.feedback?.improvePoints
                      : '개선이 없습니다.'}
                  </p>
                </div>
              </div>

              {/* 학습 추천 */}
              <div className="tw-mb-6">
                <div className="tw-text-blue-600 tw-text-base tw-font-bold tw-mb-3">학습 추천</div>
                {aiFeedbackDataTotal?.recommendations?.length > 0 ? (
                  <div className="tw-space-y-4">
                    {aiFeedbackDataTotal.recommendations.map((recommendation, index) => (
                      <div key={index} className="tw-bg-gray-50 tw-p-4 tw-rounded-lg">
                        <div className="tw-text-base tw-text-gray-700 tw-mb-3 tw-font-medium">
                          {recommendation.recommendation}
                        </div>
                        {recommendation.resources?.length > 0 && (
                          <div className="tw-space-y-2">
                            {recommendation.resources.map((resource, resourceIndex) => (
                              <div key={resourceIndex} className="tw-pl-4 tw-border-l-2 tw-border-blue-200">
                                <div className="tw-text-sm tw-font-medium tw-text-blue-800 tw-mb-1">
                                  {resource.title}
                                </div>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="tw-text-blue-500 tw-underline tw-text-sm tw-break-all"
                                >
                                  {resource.url}
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="tw-text-base">학습 추천 자료가 없습니다.</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="tw-text-base tw-text-center tw-text-gray-500 tw-h-[400px] tw-flex tw-items-center tw-justify-center">
                AI피드백 생성 버튼을 눌러 학습 총평을 확인해주세요.
              </p>
            </div>
          )}

          {/* 개별 퀴즈 피드백 요약 */}
          {aiFeedbackDataTotalQuiz && (
            <div>
              <div
                className="tw-text-black tw-text-base tw-font-bold tw-mb-3"
                style={{
                  fontFamily:
                    'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                }}
              >
                개별 퀴즈 피드백 요약
              </div>
              {aiFeedbackDataTotalQuiz?.contents.map((item, index) => (
                <div key={index}>
                  <div className="tw-mb-4">
                    <div className="border tw-border-gray-200 tw-rounded-lg tw-bg-white">
                      <div className="tw-flex tw-justify-between tw-items-center border-bottom tw-px-4">
                        <div className="tw-flex tw-items-center tw-gap-3 tw-p-4">
                          <span
                            className="tw-text-lg tw-font-bold tw-text-black"
                            style={{
                              fontFamily:
                                'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                            }}
                          >
                            {item.order}회
                          </span>
                          <span
                            className="tw-text-sm tw-text-gray-600"
                            style={{
                              fontFamily:
                                'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                            }}
                          >
                            {item.publishDate} {item.question}
                          </span>
                        </div>
                      </div>

                      <div className="tw-bg-[#F6F7FB] tw-p-6">
                        <div className="tw-mb-6">
                          <div className="tw-flex tw-items-center tw-mb-2">
                            <span className="tw-text-sm tw-font-medium tw-text-gray-700">
                              평점({item.grading || 0}/5)
                            </span>
                          </div>
                          <div className="tw-w-64">
                            <div className="tw-bg-gray-200 tw-rounded-full tw-h-2">
                              <div
                                className="tw-bg-blue-500 tw-h-2 tw-rounded-full"
                                style={{ width: `${((item.grading || 0) / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Feedback Summary */}
                        <div>
                          <div className="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">피드백 요약</div>
                          <ul className="tw-space-y-2">
                            <li className="tw-flex tw-items-start">
                              <div className="tw-w-1.5 tw-h-1.5 tw-bg-gray-400 tw-rounded-full tw-mt-2 tw-mr-3 tw-flex-shrink-0"></div>
                              <span className="tw-text-sm tw-text-gray-600">
                                {item.summaryFeedback || '피드백 요약이 없습니다.'}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {isFeedbackOptions && (
        <div className="tw-py-5">
          <div className="tw-text-black tw-text-lg tw-font-bold tw-mb-3">교수자 피드백</div>
          <textarea
            onChange={e => {
              setFeedback(e.target.value);
            }}
            className="tw-w-full tw-h-40 tw-p-2 tw-border tw-border-gray-300 tw-rounded-md"
            value={feedback || ''}
          />
        </div>
      )}
      {isAdmin && (
        <div className="tw-py-5 tw-text-center">
          <button
            onClick={() => {
              onLectureClubFeedbackSave({
                clubSequence: clubSequence,
                memberUUID: memberUUID,
                body: {
                  feedback: feedback,
                },
              });
            }}
            className="tw-text-base tw-text-center tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-md"
          >
            피드백 저장하기
          </button>
        </div>
      )}
    </div>
  );
};

export default AIFeedbackSummary;
