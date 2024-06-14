import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { paramProps, useMySeminarList, useSeminarDetail, useSeminarList } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { useSessionStore } from 'src/store/session';
import { useClubDetailQuizList } from 'src/services/quiz/quiz.queries';
import { useQuizDeleteLike, useQuizLike, useSaveLike } from 'src/services/community/community.mutations';
import QuizClubAnswersView from 'src/stories/components/QuizClubAnswersView';
import router from 'next/router';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import AIAnswerQuizList from 'src/stories/components/AIAnswerQuizList';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MentorsModal from 'src/stories/components/MentorsModal';
import CircularProgress from '@mui/material/CircularProgress';
import { useAIQuizAnswerSavePut } from 'src/services/quiz/quiz.mutations';
import Pagination from '@mui/material/Pagination';

import {
  useQuizAnswerMemberAIDetail,
  useQuizGetProgress,
  useQuizRoungeInfo,
  useQuizGetAIAnswer,
  useQuizGetAIAnswerGet,
} from 'src/services/quiz/quiz.queries';

const cx = classNames.bind(styles);
export interface QuizViewAllAnswersTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizViewAllAnswersTemplate({ id }: QuizViewAllAnswersTemplateProps) {
  const { user } = useStore();
  const [value, setValue] = React.useState(0);
  const [isBookmark, setIsBookmark] = useState(true);
  const [quizList, setQuizList] = useState<RecommendContent[]>([]);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState<boolean>(false);
  const [myParticipation, setMyParticipation] = useState(null);
  const [restTime, setRestTime] = useState(0);
  const [clubStatus, setClubStatus] = useState('0000');
  const [clubMemberStatus, setClubMemberStatus] = useState('0001');
  const [applicationButton, setApplicationButton] = useState<ReactNode>(null);
  const { memberId, logged } = useSessionStore.getState();
  const [contentHtml, setContentHtml] = useState('');
  let [isLiked, setIsLiked] = useState(false);

  const [quizListData, setQuizListData] = useState<any[]>([]);
  const [contents, setContents] = useState<any>([]);
  const [quizProgressData, setQuizProgressData] = useState<any>([]);
  const [clubQuizThreads, setClubQuizThreads] = useState<any>([]);
  const [clubQuizGetThreads, setClubQuizGetThreads] = useState<any>('');
  const [beforeOnePick, setBeforeOnePick] = useState(1);
  const [keyWorld, setKeyWorld] = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  const [page, setPage] = useState(1);
  const [params, setParams] = useState<any>({ id, page });
  const [quizParams, setQuizParams] = useState<any>({});
  const [quizSaveParams, setQuizSaveParams] = useState<any>({});
  const [listParams, setListParams] = useState<any>({ id, page });
  const [totalPage, setTotalPage] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const {
    mutate: onAIQuizAnswerSavePut,
    isSuccess: answerSuccessSavePut,
    data: aiQuizAnswerDataSavePut,
  } = useAIQuizAnswerSavePut();

  useEffect(() => {
    if (answerSuccessSavePut) {
      alert('등록이 완료되었습니다.');
    }
  }, [answerSuccessSavePut]);

  const handlerTodayQuizSolution = () => {
    if (user.phoneNumber === null || user.phoneNumber === '') {
      setIsModalOpen(true);
    } else {
      const firstItemWithNullAnswer = quizList.find(item => item.answer.answerStatus === '0000');
      router.push('/quiz/solution/' + `${firstItemWithNullAnswer?.clubQuizSequence}`);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    setParams({
      ...params,
      page,
    });
  }, [page]);

  useEffect(() => {
    if (contents?.clubQuizzes?.length > 0) {
      console.log('content!!');
      console.log(contents.clubQuizzes[0]);
      console.log(contents.clubQuizzes[0].question);
      setSelectedQuiz(contents.clubQuizzes[0]);
    }
  }, [contents]);

  const { isFetched: isParticipantListFetched, data } = useQuizRoungeInfo(id, data => {
    console.log('first get data');
    setSelectedQuiz(data.clubQuizzes[0]);
    console.log(data.clubQuizzes[0]?.quizSequence);
    setContents(data);

    setParams({
      club: id,
      quiz: data.clubQuizzes[0]?.quizSequence,
      page,
      keyword: keyWorld,
    });
  });

  const { isFetched: isQuizGetanswer, refetch: refetchQuizAnswer } = useQuizGetAIAnswer(quizParams, data => {
    console.log('second get data');
    console.log('data', data);
    setClubQuizThreads(data);
  });

  const {
    isFetched: isQuizGetanswerGet,
    refetch: refetchQuizAnswerGet,
    isSuccess: isSuccessQuizGetAnswerGet,
  } = useQuizGetAIAnswerGet(quizParams, data => {
    console.log('three get data');
    console.log('data', data);
    setClubQuizGetThreads(data);
  });

  const { isFetched: isQuizAnswer, refetch: refetchQuizPrgress } = useQuizGetProgress(params, data => {
    console.log('second get data');
    console.log('data', data);
    setQuizProgressData(data);
  });

  const {
    isFetched: isQuizAnswerListFetched,
    refetch: refetchReply,
    isSuccess,
    data: quizAnswerData,
  } = useQuizAnswerMemberAIDetail(params, data => {
    console.log('useQuizAnswerDetail', data.totalPages);
    setTotalElements(data.totalElements);
    setTotalPage(data.totalPages);
  });

  useEffect(() => {
    if (clubQuizGetThreads) {
      setIsLoadingAI(false);
    }
  }, [clubQuizGetThreads]);

  useDidMountEffect(() => {
    if (params.club) {
      refetchReply();
    }
  }, [params]);

  useDidMountEffect(() => {
    if (selectedQuiz) {
      refetchReply();
      refetchQuizPrgress();
    }
  }, [selectedQuiz]);

  useDidMountEffect(() => {
    refetchQuizAnswer();
  }, [quizParams]);

  const textInput = useRef(null);

  const handleQuizChange = event => {
    const value = event.target.value;
    const selectedSession = contents.clubQuizzes.find(
      session => session.publishDate.split('-').slice(1).join('-') === value,
    );

    if (selectedSession) {
      if (!selectedSession.isPublished) {
        alert('퀴즈가 공개되지 않았습니다.');
        setSelectedValue(''); // Reset to the default value
        setParams({
          club: id,
          quiz: data.clubQuizzes[0]?.quizSequence,
          page,
          keyword: keyWorld,
        });
        setSelectedQuiz(contents?.clubQuizzes[0]);
        return;
      } else {
        setSelectedValue(selectedSession.publishDate.split('-').slice(1).join('-'));
      }
    }

    setParams({
      club: id,
      quiz: selectedSession?.quizSequence,
      page,
      keyword: keyWorld,
    });

    setSelectedQuiz(selectedSession);
    console.log(selectedSession);
  };

  useEffect(() => {
    if (isSuccess) {
      console.log('quizAnswerData');
      console.log(quizAnswerData.contents);
      setQuizListData(quizAnswerData.contents || []);
      setTotalPage(quizAnswerData.totalPages);
    }
  }, [isSuccess, quizAnswerData]);

  const handleClick = (memberUUID: string, quizSequence: number) => {
    console.log(memberUUID, quizSequence);
    setIsModalOpen(true);
    setClubQuizGetThreads('');
    setQuizParams({
      club: id,
      quiz: selectedQuiz?.quizSequence,
      memberUUID: memberUUID,
    });
    setQuizSaveParams({
      clubSequence: id,
      quizSequence: selectedQuiz?.quizSequence,
      memberUUID: memberUUID,
    });
    // refetchQuizAnswerGet();
  };
  console.log(user);
  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <div className="tw-pt-[35px]">
          <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden border-t-0 border-r-0 border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
            <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
                나의클럽
              </p>
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
                퀴즈클럽 대시보드
              </p>
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
                퀴즈목록 전체보기
              </p>
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
                전체답변보기
              </p>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
                전체 답변보기
              </p>
            </div>
          </div>
        </div>

        <div className="tw-flex tw-py-5">
          <div className="tw-w-[300px] tw-py-4 tw-flex tw-items-center">
            <p className="tw-w-[100px] tw-text-base tw-text-[#313b49] tw-font-bold">퀴즈선택</p>
            <div className="tw-w-full">
              <select
                className="form-select block w-full tw-bg-gray-100 tw-text-red-500 tw-font-bold"
                onChange={handleQuizChange}
                value={selectedValue}
                aria-label="Default select example"
              >
                {contents?.clubQuizzes?.map((session, idx) => {
                  const isSelected = selectedQuiz?.quizSequence === session.quizSequence;
                  const isPublished = session?.isPublished === false;

                  return (
                    <option
                      key={idx}
                      className={`tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer
          ${isSelected ? 'tw-bg-red-500 tw-text-white' : ''}
          ${isPublished ? 'tw-bg-white tw-text-gray-200' : ''}
        `}
                      value={session?.publishDate.split('-').slice(1).join('-')}
                    >
                      {session?.order}.회 {session?.publishDate.split('-').slice(1).join('-')} ({session?.dayOfWeek})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="tw-p-4  tw-flex tw-items-center">
            <p className="tw-px-3 tw-text-black tw-font-bold">
              퀴즈제출 : <span className="tw-text-red-500">{quizProgressData?.solvedMemberCount}명</span> /{' '}
              {quizProgressData?.totalMemberCount}명
            </p>
            <p className="tw-px-3 tw-text-black tw-font-bold">
              오늘 제출된 답변 : <span className="tw-text-red-500">{quizProgressData?.todaySolvedMemberCount}개</span>
            </p>
            <p className="tw-px-3 tw-text-black tw-font-bold">
              피드백 현황 : <span className="tw-text-red-500">{quizProgressData?.feedbackCount}개 </span>/{' '}
              {quizProgressData?.totalMemberCount}개 (
              {quizProgressData?.totalMemberCount - quizProgressData?.feedbackCount}개 남음)
            </p>
          </div>
        </div>

        {isParticipantListFetched && (
          <>
            <div className="tw-text-black tw-font-bold tw-py-10 tw-p-4 border tw-rounded-lg tw-text-center tw-mb-4">
              <p>Q. {selectedQuiz?.question}</p>
            </div>
            <div className="tw-flex tw-justify-end tw-gap-2">
              <button
                className=" tw-bg-black max-lg:tw-mr-1  tw-rounded-md tw-text-sm tw-text-white tw-py-2.5 tw-px-4"
                // onClick={() => handleClick(info?.member?.memberUUID, info?.quizSequence)}
              >
                일괄 AI피드백/채점 (개발중)
              </button>
            </div>

            <TableContainer className="tw-py-5" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
              <Table style={{ width: '100%' }}>
                <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                  <TableRow>
                    <TableCell align="center" width={80}>
                      등록순
                    </TableCell>
                    <TableCell align="center" width={135}>
                      이름
                    </TableCell>
                    <TableCell align="center" width={400}>
                      답변
                    </TableCell>
                    <TableCell align="center">날짜</TableCell>
                    <TableCell align="center" width={340}>
                      AI채점 / 교수채점
                    </TableCell>
                    <TableCell align="center">상세보기</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isQuizAnswerListFetched &&
                    quizListData?.map((info, index) => (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell padding="none" align="center" component="th" scope="row">
                          <div className="tw-text-black">{index + 1}</div>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                          <div className="tw-flex tw-items-center tw-gap-3 tw-text-black">
                            <img className="border tw-rounded-full tw-w-8 tw-h-8" src={info?.member?.profileImageUrl} />
                            <div className="tw-text-black">{info?.member?.nickname}</div>
                          </div>
                        </TableCell>
                        <TableCell padding="none" align="left" component="th" scope="row">
                          <div className="tw-text-black tw-text-sm">{info?.text}</div>
                        </TableCell>
                        <TableCell padding="none" align="center" component="th" scope="row">
                          <div className="tw-text-black">{info?.createdAt}</div>
                        </TableCell>
                        <TableCell padding="none" align="center" component="th" scope="row">
                          <AIAnswerQuizList info={info} refetchReply={refetchReply} />
                        </TableCell>
                        <TableCell padding="none" align="center" component="th" scope="row">
                          <button
                            className="tw-w-24 max-lg:tw-mr-1 border tw-rounded-md tw-text-sm tw-text-black tw-py-2.5 tw-px-4"
                            onClick={() => handleClick(info?.member?.memberUUID, info?.quizSequence)}
                          >
                            상세보기
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="tw-flex tw-justify-center tw-p-5">
              <Pagination count={totalPage} page={page} onChange={handlePageChange} />
            </div>
          </>
        )}

        <MentorsModal title={'상세 답변보기'} isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
          {isQuizGetanswer && (
            <div className="tw-rounded-xl">
              <div className="tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-4 tw-rounded-t-xl">
                <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                  <img
                    className="tw-w-10 tw-h-10 border tw-rounded-full"
                    src={clubQuizThreads?.member?.profileImageUrl}
                  />
                  <div className="tw-text-xs tw-text-left tw-text-black">{clubQuizThreads?.member?.nickname}</div>
                </div>
                <div className="tw-flex-auto tw-px-10 tw-w-10/12">
                  <div className="tw-font-bold tw-text-black">{clubQuizThreads?.question}</div>
                </div>
              </div>
              {clubQuizThreads?.clubQuizThreads?.map((item, index) => {
                const isLastItem = index === clubQuizThreads.clubQuizThreads.length - 1;
                return (
                  <div
                    key={index}
                    className={`border-bottom border-left border-right border-secondary tw-bg-white tw-flex tw-items-center tw-p-4 tw-py-3 ${
                      isLastItem ? 'tw-rounded-bl-xl tw-rounded-br-xl' : ''
                    }`}
                  >
                    <div className="tw-w-1/12 tw-pl-14 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
                      <svg
                        width={24}
                        height={25}
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 relative"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M6 6.32422V12.3242C6 13.1199 6.31607 13.8829 6.87868 14.4455C7.44129 15.0081 8.20435 15.3242 9 15.3242H19M19 15.3242L15 11.3242M19 15.3242L15 19.3242"
                          stroke="#31343D"
                          strokeWidth={2}
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                      <img className="border tw-rounded-full tw-w-10 tw-h-10 " src={item?.member?.profileImageUrl} />
                      <div className="tw-text-xs tw-text-left tw-text-black">{item?.member?.nickname}</div>
                    </div>
                    <div className="tw-flex-auto tw-w-9/12 tw-px-5">
                      <div className="tw-py-2">
                        <p className="tw-font-medium tw-text-[#9ca5b2] tw-text-sm">
                          <span
                            className={`tw-font-bold ${
                              item?.threadType === '0003' ? 'tw-text-red-500' : 'tw-text-black'
                            }`}
                          >
                            {item?.threadType === '0001' && '사전 답변'}
                            {item?.threadType === '0002' && '사후 답변'}
                            {item?.threadType === '0003' && 'AI 모범 답변'}
                            {item?.threadType === '0004' && '교수님 피드백'}
                          </span>
                          <span className="tw-px-4">{item?.createdAt}</span>

                          {(item?.threadType === '0003' || item?.threadType === '0004') && (
                            <>
                              <div className="tw-float-right tw-text-black">
                                AI 채점 : <span className="tw-font-bold">{item?.gradingAi}</span>
                              </div>
                            </>
                          )}
                        </p>
                      </div>
                      <div className="tw-font-medium tw-text-[#9ca5b2] tw-text-sm">{item?.text}</div>

                      {item?.files?.length > 0 && (
                        <div className="tw-flex  tw-py-3">
                          <div className="tw-text-left tw-text-sm">
                            <ul className="tw-flex tw-space-x-2">
                              {item?.files?.map((file, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    onFileDownload(file.key, file.name);
                                  }}
                                  className="tw-cursor-pointer tw-px-3 tw-rounded-full border tw-p-1 tw-rounded"
                                >
                                  {file.name}
                                </div>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      <br />
                      {item?.urls?.length > 0 && (
                        <div className="tw-flex  tw-py-3">
                          <div className="tw-text-left tw-text-sm">
                            <ul className="tw-flex tw-space-x-2">
                              {item?.urls?.map((file, index) => (
                                <div
                                  key={index}
                                  onClick={() => window.open(item?.contentUrl, '_blank')}
                                  className="tw-cursor-pointer tw-px-3 tw-rounded-full border tw-p-1 tw-rounded"
                                >
                                  {file.name}
                                </div>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="tw-py-5 tw-flex tw-items-center tw-gap-3 tw-text-sm tw-text-black">
                <img src={user?.member?.profileImageUrl} className="tw-w-10 tw-h-10 border tw-rounded-full" />
                <div className="tw-flex-grow">
                  {user?.member?.nickname}
                  <button
                    onClick={() => {
                      setClubQuizGetThreads('');
                      refetchQuizAnswerGet();
                      setIsLoadingAI(true);
                    }}
                    className="tw-w-[130px] tw-ml-3 tw-rounded tw-bg-black tw-text-white tw-text-sm tw-text-black tw-py-2 tw-px-4"
                  >
                    {isLoadingAI ? <CircularProgress color="info" size={18} /> : 'AI답변 불러오기'}
                  </button>
                </div>
                <div className="tw-ml-auto">점수 : </div>
                <input
                  maxLength={3}
                  style={{
                    padding: 0,
                    height: 35,
                    width: 85,
                    textAlign: 'center',
                    backgroundColor: '#F6F7FB',
                  }}
                  type="text"
                  className="tw-bg-[#F6F7FB] tw-rounded tw-mr-2"
                  aria-label="Recipient's username with two button addons"
                />
              </div>
              <textarea
                className="tw-bg-gray-100 tw-text-sm tw-form-control tw-w-full tw-py-[8px] tw-p-5"
                id="floatingTextarea"
                placeholder="피드백을 입력해주세요."
                value={clubQuizGetThreads}
                ref={textInput}
                rows={3}
              ></textarea>
              <div className="tw-text-center tw-py-10">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                  className="tw-bg-gray-200 tw-mr-3 tw-text-white tw-text-sm tw-text-black tw-py-3 tw-px-4 tw-w-40 tw-rounded"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    // onAIQuizAnswerSavePut(quizSaveParams);
                  }}
                  className="tw-bg-red-500 tw-text-white tw-text-sm tw-text-black tw-py-3 tw-px-4 tw-w-40 tw-rounded"
                >
                  저장하기 (개발중)
                </button>
              </div>
            </div>
          )}
        </MentorsModal>

        {/* <QuizClubAnswersView
          QuizProgressData={quizProgressData}
          clubQuizThreads={clubQuizThreads}
          selectedValue={selectedValue}
          handleQuizChange={handleQuizChange}
          border={false}
          clubInfo={clubInfo}
          leaders={leaders}
          clubQuizzes={clubQuizzes}
          totalElements={totalElements}
          totalPage={totalPage}
          page={page}
          handlePageChange={handlePageChange}
          quizList={quizList}
          representativeQuizzes={representativeQuizzes}
        /> */}
      </div>
    </div>
  );
}

export default QuizViewAllAnswersTemplate;
