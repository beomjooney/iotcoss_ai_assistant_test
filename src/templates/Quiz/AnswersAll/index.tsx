import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import {
  useQuizAnswerMemberDetail,
  useQuizGetProgress,
  useQuizRoungeInfo,
  useQuizGetAnswer,
} from 'src/services/quiz/quiz.queries';
import { useRouter } from 'next/router';
/** import pagenation */
import Pagination from '@mui/material/Pagination';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import useDidMountEffect from 'src/hooks/useDidMountEffect';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MentorsModal from 'src/stories/components/MentorsModal';

import { useQuizFileDownload } from 'src/services/quiz/quiz.queries';

const cx = classNames.bind(styles);
export interface QuizAnswersAllDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizAnswersAllDetailTemplate({ id }: QuizAnswersAllDetailTemplateProps) {
  const router = useRouter();
  const { publishDate } = router.query;
  console.log('publishDate', publishDate);
  const [quizListData, setQuizListData] = useState<any[]>([]);
  const [contents, setContents] = useState<any>([]);
  const [quizProgressData, setQuizProgressData] = useState<any>([]);
  const [clubQuizThreads, setClubQuizThreads] = useState<any>([]);
  const [beforeOnePick, setBeforeOnePick] = useState(1);
  const [keyWorld, setKeyWorld] = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const [selectedValue, setSelectedValue] = useState(publishDate || '');
  const [page, setPage] = useState(1);
  const [params, setParams] = useState<any>({ id, page });
  const [quizParams, setQuizParams] = useState<any>({});
  const [listParams, setListParams] = useState<any>({ id, page });
  const [totalPage, setTotalPage] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  let [key, setKey] = useState('');
  let [fileName, setFileName] = useState('');

  const { isFetched: isParticipantListFetcheds, datas } = useQuizFileDownload(key, data => {
    // console.log('file download', data);
    if (data) {
      // blob 데이터를 파일로 저장하는 로직
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // 다운로드할 파일 이름과 확장자를 설정합니다.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });

  const { isFetched: isParticipantListFetched, data } = useQuizRoungeInfo(id, data => {
    console.log('first get data');
    let index; // `index` 변수 선언
    if (publishDate) {
      index = data?.clubQuizzes?.findIndex(item => item.publishDate === publishDate);
      console.log('index', publishDate, index);
    } else {
      index = data?.clubQuizzes?.findIndex(item => item.isPublished === true);
      console.log('index', publishDate, index);
    }
    setSelectedQuiz(data.clubQuizzes[index]);
    const selectedSession = data.clubQuizzes[index] ? data.clubQuizzes[index].publishDate : null;
    console.log('selectedSession 1', selectedSession);
    setSelectedValue(publishDate || selectedSession);
    console.log(data.clubQuizzes[index]);
    setContents(data);

    setParams({
      club: id,
      quiz: data.clubQuizzes[index]?.quizSequence,
      data: { page, keyword: keyWorld },
    });
  });

  const { isFetched: isQuizGetanswer, refetch: refetchQuizAnswer } = useQuizGetAnswer(quizParams, data => {
    console.log('second get data');
    console.log('data', data);
    setClubQuizThreads(data);
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
  } = useQuizAnswerMemberDetail(params, data => {
    console.log('useQuizAnswerDetail', data);
    setQuizListData(data.contents || []);
    setTotalPage(data.totalPages);
  });

  useDidMountEffect(() => {
    if (params.club) {
      refetchReply();
    }
  }, [params]);

  useEffect(() => {
    setParams({
      club: selectedQuiz?.clubSequence,
      quiz: selectedQuiz?.quizSequence,
      data: { page, keyword: keyWorld },
    });
    console.log('page', page);
  }, [page]);

  // useEffect(() => {
  //   if (contents?.clubQuizzes?.length > 0) {
  //     const index = contents?.clubQuizzes?.findIndex(item => item.isPublished === true);
  //     console.log('content!!');
  //     console.log(contents.clubQuizzes[index]);
  //     setSelectedQuiz(contents.clubQuizzes[index]);
  //     const result = contents.clubQuizzes.find(item => item.isPublished === true);
  //     const selectedSession = result ? result.publishDate : null;
  //     console.log(selectedSession);
  //     setSelectedValue(selectedSession);
  //   }
  // }, [contents]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleClick = (memberUUID: string, quizSequence: number) => {
    console.log(memberUUID, quizSequence);
    setIsModalOpen(true);
    setQuizParams({
      club: id,
      quiz: selectedQuiz?.quizSequence,
      memberUUID: memberUUID,
    });
  };

  useDidMountEffect(() => {
    if (selectedQuiz) {
      refetchReply();
      refetchQuizPrgress();
    }
  }, [selectedQuiz]);

  useDidMountEffect(() => {
    refetchQuizAnswer();
  }, [quizParams]);

  const handleQuizChange = event => {
    const value = event.target.value;
    const selectedSession = contents.clubQuizzes.find(
      session => session.publishDate.split('-').slice(1).join('-') === value,
    );
    //const result = contents.clubQuizzes.find(item => item.myAnswerStatus === '0003');
    //const selectedSession = result ? result.publishDate : null;

    if (selectedSession) {
      if (!selectedSession.isPublished) {
        alert('퀴즈가 공개되지 않았습니다.');
        const result = contents.clubQuizzes.find(item => item.isPublished === true);
        const selectedSessionValue = result ? result.publishDate : null;
        console.log('selectedSessionValue 2', selectedSessionValue);
        setSelectedValue(selectedSessionValue); // Reset to the default value

        const index = data?.clubQuizzes?.findIndex(item => item.isPublished === true);
        setParams({
          club: id,
          quiz: data.clubQuizzes[index]?.quizSequence,
          data: { page, keyword: keyWorld },
        });
        setSelectedQuiz(contents?.clubQuizzes[index]);
        return;
      } else {
        setSelectedValue(selectedSession.publishDate);
      }
    }

    setParams({
      club: id,
      quiz: selectedSession?.quizSequence,
      data: { page, keyword: keyWorld },
    });

    setSelectedQuiz(selectedSession);
    console.log(selectedSession);
  };

  const onFileDownload = function (key: string, fileName: string) {
    console.log(key);
    setKey(key);
    setFileName(fileName);
    // onFileDownload(key);
  };

  return (
    <>
      <Desktop>
        <div className={cx('seminar-detail-container')}>
          <div className={cx('container')}>
            <div className="tw-pt-[35px]">
              <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden border-t-0 border-r-0 border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
                <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
                    퀴즈클럽
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
                    클럽 상세보기
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
                    전체 답변보기
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
                    value={selectedValue?.split('-').slice(1).join('-')}
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
                          value={session?.publishDate?.split('-').slice(1).join('-')}
                        >
                          {session?.order}회. {session?.publishDate?.split('-').slice(1).join('-')} (
                          {session?.dayOfWeek})
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
                  오늘 제출된 답변 :{' '}
                  <span className="tw-text-red-500">{quizProgressData?.todaySolvedMemberCount}개</span>
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

                <TableContainer className="tw-py-5" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                  <Table style={{ width: '100%' }}>
                    <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                      <TableRow>
                        <TableCell align="center" width={100}>
                          등록순
                        </TableCell>
                        <TableCell align="center" width={150}>
                          이름
                        </TableCell>
                        <TableCell align="center" width={400}>
                          답변
                        </TableCell>
                        <TableCell align="center">날짜</TableCell>
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
                                <img
                                  className="border tw-rounded-full tw-w-8 tw-h-8"
                                  src={info?.member?.profileImageUrl}
                                />
                                <div className="tw-text-black">{info?.member?.nickname}</div>
                              </div>
                            </TableCell>
                            <TableCell padding="none" align="left" component="th" scope="row">
                              <div className="tw-text-black">{info?.text}</div>
                            </TableCell>
                            <TableCell padding="none" align="center" component="th" scope="row">
                              <div className="tw-text-black">{info?.createdAt}</div>
                            </TableCell>
                            <TableCell padding="none" align="center" component="th" scope="row">
                              <button
                                className="tw-w-24 max-lg:tw-mr-1 tw-bg-black tw-rounded-md tw-text-xs tw-text-white tw-py-2.5 tw-px-4"
                                onClick={() => handleClick(info?.member?.memberUUID, info?.quizSequence)}
                              >
                                더보기
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            <div className="tw-flex tw-justify-center tw-mt-10">
              <Pagination count={totalPage} page={page} onChange={handlePageChange} />
            </div>
          </div>
        </div>

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
                    <div className="tw-w-1.5/12 tw-pl-5 tw-pr-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
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
                      <div className="tw-text-xs tw-text-left tw-text-black tw-mt-2">{item?.member?.nickname}</div>
                    </div>
                    <div className="tw-flex-auto tw-w-9/12 tw-px-5">
                      <div className="tw-py-2">
                        <p className="tw-font-medium tw-text-[#9ca5b2] tw-text-sm tw-line-clamp-2">
                          <span className="tw-text-black tw-font-bold">
                            {(() => {
                              switch (item?.threadType) {
                                case '0001':
                                  return '사전답변';
                                case '0002':
                                  return '사후답변';
                                case '0003':
                                  return 'AI 모범 답변';
                                case '0004':
                                  return '교수님 평가';
                                default:
                                  return '알 수 없는 상태';
                              }
                            })()}
                          </span>{' '}
                          <span className="tw-px-4">{item?.createdAt}</span>
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
            </div>
          )}
        </MentorsModal>
      </Desktop>
    </>
  );
}

export default QuizAnswersAllDetailTemplate;
