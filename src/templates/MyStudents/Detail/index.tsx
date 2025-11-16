import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { paramProps, useMyStudentsDetail } from 'src/services/seminars/seminars.queries';
import { MyClubsListResponse, ClubContent } from 'src/models/user';
import { AdvisorData, MentorsModal, Pagination } from 'src/stories/components';
import {
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Divider,
} from '@mui/material';
import AIFeedbackSummary from 'src/stories/components/AIFeedbackSummary';
import { useLectureClubEvaluationMember } from 'src/services/community/community.mutations';
import { useQuizAIFeedbackLectureGetMember, useQuizAIFeedbackLectureGetTotal } from 'src/services/quiz/quiz.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useGetProfile } from 'src/services/account/account.queries';
import MyProfile from 'src/stories/components/MyProfile';
import { useRouter } from 'next/router';

const cx = classNames.bind(styles);

const ITEMS_PER_PAGE = 10;

export interface MyStudentsDetailTemplateProps {
  /** 학생 아이디 */
  id?: any;
}

export function MyStudentsDetailTemplate({ id }: MyStudentsDetailTemplateProps) {
  const router = useRouter();
  const [contents, setContents] = useState<ClubContent[]>([]);
  const [advisor, setAdvisor] = useState<AdvisorData>({} as AdvisorData);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [params, setParams] = useState<paramProps>({ page, adviseeUUID: id, size: ITEMS_PER_PAGE });
  const [selectedStudentInfo, setSelectedStudentInfo] = useState<any>(null);
  const [isAIFeedbackModalOpen, setIsAIFeedbackModalOpen] = useState(false);
  const [aiEvaluationParamsTotal, setAiEvaluationParamsTotal] = useState(null);
  const [memberUUIDList, setMemberUUIDList] = useState('');
  const [comprehensiveEvaluationEnabled, setComprehensiveEvaluationEnabled] = useState(false);
  // 개별 클럽별 로딩 상태 관리
  const [loadingClubs, setLoadingClubs] = useState<Record<number, boolean>>({});
  const [aiFeedbackDataTotal, setAiFeedbackDataTotal] = useState<any>(null);
  const [aiFeedbackDataTotalQuiz, setAiFeedbackDataTotalQuiz] = useState<any>(null);
  const [profile, setProfile] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 클럽 목록 조회
  const {
    isFetched: isContentFetched,
    isLoading: isDataLoading,
    refetch,
  } = useMyStudentsDetail(params, (data: MyClubsListResponse) => {
    console.log('data', data);
    if (data?.data) {
      console.log('data.data.member', data.data.member);
      setContents(data.data.paging.contents || []);
      setAdvisor(data.data.member || {});
      setTotalPage(data.data.paging.totalPages || 1);
      setTotalElements(data.data.paging.totalElements || 0);
    }
  });

  useEffect(() => {
    setParams({
      ...params,
      page,
    });
  }, [page]);

  // AI 피드백 데이터 조회
  const {
    refetch: refetchAIEvaluationTotal,
    isError: isErrorAIEvaluationTotal,
    isSuccess: isSuccessAIEvaluationTotal,
  } = useQuizAIFeedbackLectureGetMember(aiEvaluationParamsTotal, data => {
    console.log('🎉 AI Evaluation Total SUCCESS:', data);
    setAiFeedbackDataTotal(data);
  });

  useEffect(() => {
    if (isErrorAIEvaluationTotal) {
      // 모든 로딩 상태 해제
      setLoadingClubs({});
      setIsLoading(false);
      setIsAIFeedbackModalOpen(false);
    }
  }, [isErrorAIEvaluationTotal]);

  // AI 개별 피드백 데이터 조회
  useDidMountEffect(() => {
    if (aiEvaluationParamsTotal) {
      refetchAIEvaluationTotal();
    }
  }, [aiEvaluationParamsTotal]);

  const {
    mutate: onLectureClubEvaluationMember,
    isSuccess: lectureClubEvaluationMemberSucces,
    isError: lectureClubEvaluationMemberError,
  } = useLectureClubEvaluationMember();

  useEffect(() => {
    if (lectureClubEvaluationMemberError || lectureClubEvaluationMemberSucces) {
      // 모든 로딩 상태 해제
      console.log('refetchAIEvaluationTotal');
      refetchAIEvaluationTotal();
      setLoadingClubs({});
      setIsLoading(false);
      setAiFeedbackDataTotal(null);
    }
  }, [lectureClubEvaluationMemberError, lectureClubEvaluationMemberSucces]);

  // 회원 프로필 정보
  const { isFetched: isProfileFetched, refetch: refetchProfile } = useGetProfile(advisor.memberUUID, (data: any) => {
    console.log(data?.data?.data);
    setProfile(data?.data?.data);
  });

  const handleClickProfile = memberUUID => {
    refetchProfile();
    setIsModalOpen(true);
    console.log('memberUUID1', memberUUID);
  };

  const handleBack = () => {
    router.push('/my-students');
  };

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <div className="tw-pt-8">
          <div className="tw-flex tw-justify-start tw-items-start tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">My학습자</p>
            <svg
              width={17}
              height={16}
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[15.75px] tw-h-[15.75px] tw-relative"
              preserveAspectRatio="none"
            >
              <path
                d="M6.96925 11.25L10.3438 7.8755L6.96925 4.50101L6.40651 5.06336L9.21905 7.8755L6.40651 10.6877L6.96925 11.25Z"
                fill="#313B49"
              />
            </svg>
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              지도학생 상세보기
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              지도학생 상세보기
            </p>
          </div>
        </div>
        <Divider className="tw-py-3 tw-mb-5" />
        <div className={cx('content-area tw-pt-30')}>
          <div>
            <div className="tw-bg-white border tw-rounded-lg  tw-p-6 tw-flex tw-justify-between tw-items-center">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-center">
                {/* 교수자 정보 */}
                <div className="tw-col-span-3 tw-flex tw-items-center tw-gap-3">
                  <div className="tw-flex-shrink-0">
                    <img
                      src={advisor.profileImageUrl || '/assets/images/banner/Rectangle_193.png'}
                      alt={`${advisor.nickname} 프로필`}
                      className="tw-w-9 tw-h-9 tw-rounded-full tw-object-cover tw-border-2 tw-border-gray-200"
                      onError={e => {
                        (e.target as HTMLImageElement).src = '/assets/images/banner/Rectangle_193.png';
                      }}
                    />
                  </div>

                  <div className="">
                    <div className="tw-text-sm tw-font-semibold tw-text-gray-900 tw-truncate tw-flex tw-items-center tw-gap-2">
                      <span className="tw-inline-flex tw-px-2 tw-py-1 tw-rounded-lg tw-text-sm tw-font-semibold border tw-text-gray-700">
                        교수자
                      </span>
                      {advisor.nickname}
                    </div>
                  </div>
                </div>

                {/* 이메일 */}
                <div className="tw-col-span-6 tw-flex tw-items-center tw-gap-2">
                  <span className="tw-text-sm tw-text-gray-900 tw-truncate">{advisor.memberId}</span>

                  <span className="tw-inline-flex tw-px-2 tw-py-1 tw-rounded-lg tw-text-sm tw-font-semibold tw-bg-blue-100 tw-text-blue-700 tw-truncate tw-max-w-full tw-text-center">
                    {advisor.jobGroup?.name}
                  </span>

                  <span className="tw-inline-flex tw-px-2 tw-py-1 tw-rounded-lg tw-text-sm tw-font-semibold tw-bg-gray-100 tw-text-gray-700 tw-truncate tw-max-w-full">
                    {advisor.job?.name}
                  </span>
                </div>
              </div>
              <div className="tw-flex tw-justify-end tw-items-center tw-gap-2 tw-w-[300px]">
                <button
                  onClick={() => handleClickProfile(advisor.memberUUID)}
                  className="tw-text-sm tw-text-center border tw-text-black tw-px-4 tw-py-2 tw-rounded-md tw-w-[100px]"
                >
                  프로필 보기
                </button>
                <button
                  className="border tw-text-gray-400 tw-px-4 tw-py-2 tw-rounded-md tw-w-[100px] tw-text-sm"
                  onClick={handleBack}
                >
                  뒤로가기기
                </button>
              </div>
            </div>
          </div>
          <section className={cx('content', 'flex-wrap-container tw-w-full tw-mt-10 tw-min-h-[500px]')}>
            {isDataLoading ? (
              <div className="tw-flex tw-justify-center tw-items-center tw-py-40">
                <CircularProgress />
              </div>
            ) : (
              isContentFetched && (
                <TableContainer
                  component={Paper}
                  className="tw-rounded-lg"
                  sx={{
                    boxShadow: 'none',
                    border: 'none',
                    '& .MuiTableCell-root': {},
                  }}
                >
                  <Table sx={{ minWidth: 650, border: 'none' }} aria-label="클럽 테이블">
                    <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                          No
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px', width: '300px' }}>
                          강의명
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                          대학명
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                          학과명
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                          기간
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                          교수자
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                          수강현황
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                          총평
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contents.length > 0 ? (
                        contents.map((clubContent, index) => {
                          const displayIndex = (page - 1) * ITEMS_PER_PAGE + index + 1;

                          return (
                            <TableRow
                              key={clubContent.clubSequence}
                              sx={{
                                '&:hover': {
                                  backgroundColor: '#f9f9f9',
                                },
                              }}
                            >
                              <TableCell align="center" sx={{ fontSize: '15px' }}>
                                {displayIndex}
                              </TableCell>
                              <TableCell align="left" sx={{ fontSize: '15px', fontWeight: '500' }}>
                                {clubContent.clubName}
                              </TableCell>
                              <TableCell align="center" sx={{ fontSize: '15px' }}>
                                <div className="tw-flex tw-flex-col tw-gap-1">
                                  {clubContent.jobGroups.map((jobGroup, idx) => (
                                    <span key={idx} className="tw-text-blue-600">
                                      {jobGroup.name}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell align="center" sx={{ fontSize: '15px' }}>
                                <div className="tw-flex tw-flex-col tw-gap-1">
                                  {clubContent.jobs.map((job, idx) => (
                                    <span key={idx} className="tw-text-gray-600">
                                      {job.name}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell align="center" sx={{ fontSize: '14px', color: '#666' }}>
                                <div className="tw-flex tw-flex-col tw-gap-1">
                                  <span>
                                    {new Date(clubContent.startAt).toLocaleDateString('ko-KR', {
                                      year: '2-digit',
                                      month: '2-digit',
                                      day: '2-digit',
                                    })}
                                    ~
                                  </span>
                                  <span>
                                    {new Date(clubContent.endAt).toLocaleDateString('ko-KR', {
                                      year: '2-digit',
                                      month: '2-digit',
                                      day: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell align="left">
                                <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
                                  <Avatar
                                    src={clubContent.instructor.profileImageUrl || undefined}
                                    alt={clubContent.instructor.nickname}
                                    sx={{ width: 32, height: 32 }}
                                  >
                                    {!clubContent.instructor.profileImageUrl &&
                                      clubContent.instructor.nickname?.charAt(0)}
                                  </Avatar>
                                  <span className="tw-text-sm tw-font-medium">{clubContent.instructor.nickname}</span>
                                </div>
                              </TableCell>
                              <TableCell align="center">
                                {/* <Chip
                                  label={getStatusLabel(clubContent.status)}
                                  color={getStatusColor(clubContent.status)}
                                  size="small"
                                  variant="outlined"
                                /> */}
                                <div className="tw-text-base">
                                  {clubContent.status === '0000' ? (
                                    <div className="tw-text-gray-600">
                                      <p>임시저장</p>
                                    </div>
                                  ) : clubContent.status === '0100' ? (
                                    <div className="tw-text-blue-600">
                                      <p>개설요청대기</p>
                                    </div>
                                  ) : clubContent.status === '0110' ? (
                                    <div className="tw-text-blue-600">
                                      <p>개설요청승인</p>
                                    </div>
                                  ) : clubContent.status === '0120' ? (
                                    <div className="tw-text-red-600">
                                      <p>개설요청반려</p>
                                    </div>
                                  ) : clubContent.status === '0200' ? (
                                    <div className="tw-text-blue-600">
                                      <p>진행예정</p>
                                    </div>
                                  ) : clubContent.status === '0210' ? (
                                    <div className="tw-text-blue-600">
                                      <p>진행연기</p>
                                    </div>
                                  ) : clubContent.status === '0220' ? (
                                    <div className="tw-text-blue-600">
                                      <p>취소</p>
                                    </div>
                                  ) : clubContent.status === '0300' ? (
                                    <div className="tw-text-blue-600">
                                      <p>모집중</p>
                                    </div>
                                  ) : clubContent.status === '0310' ? (
                                    <div className="tw-text-blue-600">
                                      <p>모집마감</p>
                                    </div>
                                  ) : clubContent.status === '0400' ? (
                                    <div className="tw-text-blue-600">
                                      <p>진행중</p>
                                    </div>
                                  ) : clubContent.status === '0500' ? (
                                    <div className="tw-text-blue-600">
                                      <p>진행완료</p>
                                    </div>
                                  ) : clubContent.status === '0900' ? (
                                    <div className="tw-text-blue-600">
                                      <p>삭제</p>
                                    </div>
                                  ) : (
                                    <div className="tw-text-gray-600">
                                      <p>모집 대기중</p>
                                    </div>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell align="center">
                                <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
                                  {/* <button
                                    onClick={() => {
                                      // 개별 클럽의 로딩 상태 설정
                                      setLoadingClubs(prev => ({ ...prev, [clubContent.clubSequence]: true }));
                                      onLectureClubEvaluationMember({
                                        clubSequence: clubContent?.clubSequence || id,
                                        memberUUID: advisor?.memberUUID,
                                      });
                                    }}
                                    disabled={!clubContent?.comprehensiveEvaluationEnabled}
                                    className={`tw-w-[90px] tw-gap-1 tw-p-1 tw-rounded-[5px] tw-flex tw-justify-center tw-items-center tw-bg-[#6A7380] tw-text-white tw-cursor-pointer tw-text-sm tw-mx-auto ${
                                      clubContent?.comprehensiveEvaluationEnabled
                                        ? 'tw-bg-[#6A7380] tw-text-white tw-cursor-pointer'
                                        : 'tw-bg-gray-300 tw-text-gray-500 tw-cursor-not-allowed'
                                    }`}
                                  >
                                    <p>{loadingClubs[clubContent.clubSequence] ? '1~2분소요' : 'AI총평생성'}</p>
                                    <svg
                                      width={7}
                                      height={10}
                                      viewBox="0 0 7 10"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="flex-grow-0 flex-shrink-0"
                                      preserveAspectRatio="none"
                                    >
                                      <path d="M1 1L5 5L1 9" stroke="#fff" strokeWidth="1.5" />
                                    </svg>
                                  </button> */}
                                  {clubContent.status !== '0900' && (
                                    <button
                                      onClick={() => {
                                        if (!clubContent?.comprehensiveEvaluationViewable) {
                                          return;
                                        }
                                        setSelectedStudentInfo(clubContent);
                                        setIsAIFeedbackModalOpen(true);
                                        setAiEvaluationParamsTotal({
                                          clubSequence: clubContent?.clubSequence || id,
                                          memberUUID: advisor?.memberUUID,
                                        });
                                        setMemberUUIDList(advisor?.memberUUID);
                                        setComprehensiveEvaluationEnabled(clubContent?.comprehensiveEvaluationEnabled);
                                      }}
                                      disabled={!clubContent?.comprehensiveEvaluationViewable}
                                      className={`tw-gap-1 tw-p-1 tw-rounded-[5px] tw-w-[70px] tw-flex tw-justify-center tw-items-center tw-bg-[#6A7380] tw-text-white tw-cursor-pointer tw-text-sm tw-mx-auto ${clubContent?.comprehensiveEvaluationViewable
                                          ? 'tw-bg-[#6A7380] tw-text-white tw-cursor-pointer'
                                          : 'tw-bg-gray-300 tw-text-gray-500 tw-cursor-not-allowed'
                                        }`}
                                    >
                                      <p>총평확인</p>
                                      <svg
                                        width={7}
                                        height={10}
                                        viewBox="0 0 7 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="flex-grow-0 flex-shrink-0"
                                        preserveAspectRatio="none"
                                      >
                                        <path d="M1 1L5 5L1 9" stroke="#fff" strokeWidth="1.5" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#999' }}>
                            {isDataLoading ? '데이터를 불러오는 중...' : '등록된 클럽이 없습니다.'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            )}
          </section>
          <div className="tw-flex tw-flex-col tw-items-center tw-py-10 tw-gap-2">
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </div>
      </div>
      {/* AI 피드백 모달 */}
      <MentorsModal
        isOpen={isAIFeedbackModalOpen}
        isContentModalClick={true}
        onAfterClose={() => {
          setIsAIFeedbackModalOpen(false);
          setIsLoading(false);
          setSelectedStudentInfo(null);
          setAiFeedbackDataTotal(null);
        }}
        title={'학습피드백 총평'}
      >
        <div>
          <div className="tw-flex tw-justify-between tw-items-center tw-gap-4 tw-mb-4">
            <div className="tw-text-xl tw-font-bold tw-text-black tw-text-center">총평피드백 보기</div>

            {comprehensiveEvaluationEnabled && (
              <button
                disabled={!comprehensiveEvaluationEnabled}
                onClick={() => {
                  onLectureClubEvaluationMember({
                    clubSequence: selectedStudentInfo?.clubSequence || id,
                    memberUUID: memberUUIDList,
                  });
                  setIsLoading(true);
                  console.log('refetchAIEvaluationTotal');
                }}
                className={`tw-text-base tw-text-center tw-bg-black tw-text-white tw-px-4 tw-py-2 tw-rounded-md ${!comprehensiveEvaluationEnabled
                    ? 'tw-bg-gray-300 tw-text-gray-500 tw-cursor-not-allowed'
                    : 'tw-bg-black tw-text-white tw-cursor-pointer'
                  }`}
              >
                {isLoading
                  ? 'AI피드백 생성중...'
                  : aiFeedbackDataTotal?.evaluationStatus === '0001'
                    ? 'AI피드백 생성'
                    : 'AI피드백 재생성'}
              </button>
            )}
            {!comprehensiveEvaluationEnabled && (
              <div className="tw-text-base tw-text-center tw-bg-gray-300 tw-text-gray-500 tw-px-4 tw-py-2 tw-rounded-md">
                총평을 생성하기에 질문이 부족합니다.
              </div>
            )}
          </div>
          <AIFeedbackSummary
            aiFeedbackDataTotal={aiFeedbackDataTotal}
            aiFeedbackDataTotalQuiz={aiFeedbackDataTotalQuiz}
            isLoading={isLoading}
            isFeedbackOptions={true}
            isAdmin={true}
            clubSequence={selectedStudentInfo?.clubSequence || id}
            memberUUID={memberUUIDList}
            isTotalFeedback={false}
          />
        </div>
      </MentorsModal>
      <MentorsModal
        title={'프로필 보기'}
        isOpen={isModalOpen}
        isProfile={true}
        isContentModalClick={false}
        onAfterClose={() => setIsModalOpen(false)}
      >
        {isProfileFetched && (
          <div>
            <MyProfile
              admin={true}
              profile={profile}
              badgeContents={[]}
              refetchProfile={refetchProfile}
              isProfile={false}
              isRequestingAdvisors={false}
            />
          </div>
        )}
      </MentorsModal>
    </div>
  );
}

export default MyStudentsDetailTemplate;
