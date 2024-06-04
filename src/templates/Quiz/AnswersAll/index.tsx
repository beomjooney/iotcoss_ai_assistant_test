import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import { CommunityCard } from 'src/stories/components';
import { RecommendContent } from 'src/models/recommend';
import { useQuizAnswerMemberDetail, useQuizRankDetail, useQuizRoungeInfo } from 'src/services/quiz/quiz.queries';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import Avatar from '@mui/material/Avatar';
/** import icon */
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';

/** import pagenation */
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import useDidMountEffect from 'src/hooks/useDidMountEffect';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const cx = classNames.bind(styles);
export interface QuizAnswersAllDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizAnswersAllDetailTemplate({ id }: QuizAnswersAllDetailTemplateProps) {
  const router = useRouter();
  const [quizListData, setQuizListData] = useState<any[]>([]);
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [rankContents, setRankContents] = useState<RecommendContent[]>([]);
  const [answerContents, setAnswerContents] = useState<RecommendContent[]>([]);
  const [bestAnswerContents, setBestAnswerContents] = useState<RecommendContent[]>([]);
  const [myAnswerContents, setMyAnswerContents] = useState<RecommendContent[]>([]);
  const [beforeOnePick, setBeforeOnePick] = useState(1);
  const [keyWorld, setKeyWorld] = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  const [page, setPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ id, page });
  let [isLiked, setIsLiked] = useState(false);
  const [totalPage, setTotalPage] = useState(1);

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleQuizClick = quiz => {
    console.log(quiz);
    setSelectedQuiz(quiz);

    setParams({
      club: id,
      quiz: quiz?.quizSequence,
      data: { page, keyword: keyWorld },
    });
  };

  const { isFetched: isParticipantListFetched, data } = useQuizRoungeInfo(id, data => {
    console.log('first get data');
    setSelectedQuiz(data.clubQuizzes[0]);
    console.log(data.clubQuizzes[0]);
    setContents(data);

    setParams({
      club: id,
      quiz: data.clubQuizzes[0]?.quizSequence,
      data: { page, keyword: keyWorld },
    });
  });

  useEffect(() => {
    if (contents?.clubQuizzes?.length > 0) {
      console.log('content!!');
      console.log(contents.clubQuizzes[0]);
      console.log(contents.clubQuizzes[0].question);
      setSelectedQuiz(contents.clubQuizzes[0]);
    }
  }, [contents]);

  const {
    isFetched: isQuizAnswerListFetched,
    refetch: refetchReply,
    isSuccess,
    data: quizAnswerData,
  } = useQuizAnswerMemberDetail(params, data => {
    console.log('useQuizAnswerDetail');
  });

  useEffect(() => {
    if (isSuccess) {
      console.log('quizAnswerData');
      console.log(quizAnswerData);
      console.log(quizAnswerData.contents);
      setQuizListData(quizAnswerData.contents || []);
      setTotalPage(quizAnswerData.totalPages);
    }
  }, [isSuccess, quizAnswerData]);

  useEffect(() => {
    setParams({
      club: selectedQuiz?.clubSequence,
      quiz: selectedQuiz?.quizSequence,
      data: { page, keyword: keyWorld },
    });
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getButtonText = status => {
    switch (status) {
      case '0002':
        return '가입완료';
      case '0200':
        return '개설 예정';
      case '0210':
        return '개설 연기';
      case '0220':
        return '취소';
      case '0300':
        return '모집중';
      case '0310':
        return '모집완료';
      case '4000':
        return '진행중';
      case '0500':
        return '완료';
    }
  };

  useDidMountEffect(() => {
    if (selectedQuiz) refetchReply();
  }, [selectedQuiz]);

  const handleQuizChange = event => {
    const value = event.target.value;
    const selectedSession = contents.clubQuizzes.find(
      session => session.publishDate.split('-').slice(1).join('-') === value,
    );

    if (selectedSession) {
      if (!selectedSession.isPublished) {
        alert('퀴즈가 공개되지 않았습니다.');
        setSelectedValue(''); // Reset to the default value
        return;
      } else {
        setSelectedValue(selectedSession.publishDate.split('-').slice(1).join('-'));
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
                          {session?.order}.회 {session?.publishDate.split('-').slice(1).join('-')} ({session?.dayOfWeek}
                          )
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="tw-p-4"></div>
            </div>

            {isParticipantListFetched && (
              <>
                <div className="tw-py-5 tw-p-4 border tw-rounded-lg tw-text-center">
                  <p>{selectedQuiz?.question}</p>
                </div>

                <div className="tw-h-[280] tw-relative tw-overflow-hidden tw-rounded-[8.75px] tw-bg-white border border-[#e9ecf2] tw-grid tw-grid-cols-3 tw-gap-4">
                  <div className="tw-col-span-1">
                    <img src={contents?.club?.clubImageUrl} width={320} height={320} className="tw-object-cover" />
                  </div>
                  <div className="tw-col-span-2 tw-flex tw-flex-col tw-py-4 tw-pr-4">
                    <div className="tw-col-span-2 tw-flex tw-flex-col tw-py-4 tw-pr-4">
                      <div className="tw-flex tw-gap-[7px]">
                        <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                          <p className="tw-text-[12.25px] tw-text-[#235a8d]">{contents?.club?.jobGroups[0].name}</p>
                        </div>
                        <div className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                          <p className="tw-text-[12.25px] tw-text-[#313b49]">{contents?.club?.jobLevels[0].name}</p>
                        </div>
                        <div className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-[10.5px] tw-py-[3.5px]">
                          <p className="tw-text-[12.25px] tw-text-[#b83333]">{contents?.club?.jobs[0].name}</p>
                        </div>
                        <div className="tw-flex-1"></div>{' '}
                        {/* 빈 div로 flex-grow를 추가하여 버튼을 오른쪽으로 밀어냅니다. */}
                        <button
                          className=""
                          onClick={() => {
                            onChangeLike(contents?.club?.clubSequence);
                          }}
                        >
                          {isLiked ? <StarIcon color="primary" /> : <StarBorderIcon color="disabled" />}
                        </button>
                      </div>
                    </div>

                    <div className="tw-text-[20.5px] tw-font-bold tw-text-black tw-mt-4">
                      {contents?.club?.clubName}
                    </div>
                    <p className="tw-text-[12.25px] tw-mt-2 tw-text-black">{contents?.club?.description}</p>
                    <div className="tw-mt-4">
                      <p className="tw-text-sm tw-text-black">
                        학습 주기 : 매주 {contents?.club?.studyCycle.toString()}요일 (총 {contents?.club?.studyCycle}회)
                      </p>
                      <p className="tw-text-sm tw-text-black">
                        학습 기간 : {contents?.club?.weekCount}주 ({contents?.club?.startAt.split(' ')[0]} ~{' '}
                        {contents?.club?.endAt.split(' ')[0]})
                      </p>
                      <p className="tw-text-sm tw-text-black">
                        참여 현황 : {contents?.club?.publishedCount} / {contents?.club?.studyCount} 학습중
                      </p>
                      <p className="tw-text-sm tw-text-black">참여 인원 : {contents?.club?.recruitedMemberCount}명</p>
                    </div>
                    <div className="tw-flex tw-items-center tw-mt-auto tw-justify-between tw-w-full">
                      <div className="tw-flex tw-items-center">
                        <img
                          src={contents?.club?.leaderProfileImageUrl}
                          width={28}
                          className="tw-mr-2 border tw-rounded-full"
                        />
                        <p className="tw-text-sm tw-text-black">{contents?.club?.leaderNickname}</p>
                      </div>
                      <div className="tw-flex tw-gap-4">
                        <div className="tw-bg-gray-400 tw-rounded-[3.5px]  tw-w-[130px] tw-py-[10.0625px] tw-cursor-pointer">
                          <p className="tw-text-[12.25px] tw-font-bold tw-text-white tw-text-center">
                            {getButtonText(contents?.club?.clubStatus)}
                          </p>
                        </div>
                        <div
                          className="tw-bg-[#e11837] tw-rounded-[3.5px] tw-w-[130px] tw-py-[10.0625px] tw-cursor-pointer"
                          onClick={() => router.push('/quiz/' + `${contents?.club?.clubSequence}`)}
                        >
                          <p className="tw-text-[12.25px] tw-font-bold tw-text-white tw-text-center">퀴즈상세보기</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <TableContainer className="tw-py-5" aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                  <Table style={{ width: '100%' }}>
                    <TableHead style={{ backgroundColor: '#F6F7FB' }}>
                      <TableRow>
                        <TableCell align="center">등록순</TableCell>
                        <TableCell align="center" width={120}>
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
                                  className={info?.member?.profileImageUrl ? '' : 'tw-opacity-50'}
                                  src="/assets/images/quiz/아그리파_1.png"
                                  alt="아그리파"
                                />
                                <div className="tw-text-black">{info?.member?.nickname}</div>
                              </div>
                            </TableCell>
                            <TableCell padding="none" align="center" component="th" scope="row">
                              <div className="tw-text-black">{info?.text}</div>
                            </TableCell>
                            <TableCell padding="none" align="center" component="th" scope="row">
                              <div className="tw-text-black">{info?.createdAt}</div>
                            </TableCell>
                            <TableCell padding="none" align="center" component="th" scope="row">
                              <button
                                className="tw-w-24 max-lg:tw-mr-1 tw-bg-black tw-rounded-md tw-text-xs tw-text-white tw-py-2.5 tw-px-4"
                                onClick={() => (location.href = '/quiz-my')}
                              >
                                AI답변보기
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
      </Desktop>
    </>
  );
}

export default QuizAnswersAllDetailTemplate;
