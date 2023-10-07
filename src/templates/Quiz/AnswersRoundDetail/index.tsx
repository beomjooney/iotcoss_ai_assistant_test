import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { Button, CommunityCard } from 'src/stories/components';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useMySeminarList, useSeminarDetail, useSeminarList } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import {
  useClubDetailQuizList,
  useQuizAnswerDetail,
  useQuizRankDetail,
  useQuizSolutionDetail,
} from 'src/services/quiz/quiz.queries';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

/** import icon */
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';

/** import pagenation */
import Pagination from '@mui/material/Pagination';

const cx = classNames.bind(styles);
export interface QuizAnswersRoundDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizAnswersRoundDetailTemplate({ id }: QuizAnswersRoundDetailTemplateProps) {
  const { user } = useStore();
  const [value, setValue] = React.useState(0);
  const [isBookmark, setIsBookmark] = useState(true);
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [rankContents, setRankContents] = useState<RecommendContent[]>([]);
  const [answerContents, setAnswerContents] = useState<RecommendContent[]>([]);
  const [quizList, setQuizList] = useState<RecommendContent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState<boolean>(false);
  const [myParticipation, setMyParticipation] = useState(null);
  const [restTime, setRestTime] = useState(0);
  const [clubStatus, setClubStatus] = useState('0000');
  const [clubMemberStatus, setClubMemberStatus] = useState('0001');
  const [applicationButton, setApplicationButton] = useState<ReactNode>(null);
  const { memberId, logged } = useSessionStore.getState();
  const [contentHtml, setContentHtml] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [params, setParams] = useState<paramProps>({ id, page });
  let [isLiked, setIsLiked] = useState(false);

  const { isFetched: isParticipantListFetched, data } = useQuizSolutionDetail(id, data => {
    setContents(data);
  });
  const { isFetched: isQuizAnswerListFetched } = useQuizAnswerDetail(params, data => {
    //console.log(data);
    setAnswerContents(data?.contents);
    setTotalElements(data?.totalElements);
    setTotalPage(data?.totalPages);
  });
  const { isFetched: isQuizRankListFetched } = useQuizRankDetail(data => {
    setRankContents(data);
  });

  let tabPannelRefs = [];

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleClickTab = index => {
    tabPannelRefs[index].current?.scrollIntoView({ block: 'center' });
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    className?: any;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, className, ...other } = props;
    tabPannelRefs[index] = useRef();

    return (
      <div
        role="tabpanel"
        id={`seminar-tabpanel-${index}`}
        className={cx(`seminar-tabpanel-${index}`, 'seminar-tabpanel', className)}
        aria-labelledby={`simple-tab-${index}`}
        ref={tabPannelRefs[index]}
        {...other}
      >
        {children}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const lectureName = () => {
    return data?.seminarLecturer?.nickname ?? data?.seminarLecturer?.name;
  };

  useEffect(() => {
    setParams({
      // ...params,
      id,
      page,
    });
  }, [page]);

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <div className="tw-py-[60px]">
          <Grid container direction="row" justifyContent="space-between" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black">
              라운지
            </Grid>
            <Grid item xs={8} className="max-lg:tw-p-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-sm">
              모든 퀴즈클럽과 답변을 한 곳에서 볼 수 있고, 한달동안 우수한 성장을 이룬 클럽/메이커/리더를 발표해요!
            </Grid>
            <Grid item xs={2} justifyContent="flex-end" className="tw-flex">
              <button
                onClick={() => router.back()}
                type="button"
                className="tw-text-white tw-bg-blue-500  tw-focus:ring-4  tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
              >
                뒤로가기
              </button>
            </Grid>
          </Grid>

          {/* <div className="tw-py-4 tw-text-sm tw-font-normal tw-text-gray-500 ">
            {contents?.recommendJobGroupNames?.map((name, i) => (
              <span
                key={i}
                className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600"
              >
                {name}
              </span>
            ))}
            <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
              {contents?.recommendLevels?.sort().join(',')}레벨
            </span>
            {contents?.recommendJobNames?.map((name, i) => (
              <span
                key={i}
                className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-100 tw-text-sm tw-font-light tw-text-gray-600"
              >
                {name}
              </span>
            ))}
          </div>
          <div className="tw-text-black tw-font-bold tw-text-2xl tw-py-4">{contents?.clubName}</div> */}
        </div>

        <Grid container direction="row" justifyContent="left" rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={8}>
            <div className="tw-bg-gray-50 tw-rounded-lg tw-px-8 tw-py-5 tw-text-black ">
              <div className="tw-flex tw-items-center tw-space-x-4 tw-my-2">
                <img
                  className="tw-w-12 tw-h-12 tw-ring-1 tw-rounded-full"
                  src={contents?.clubLeaderProfileImageUrl}
                  alt=""
                />
                <div className="tw-text-base tw-font-semibold tw-text-black">
                  <div>{contents?.clubLeaderNickname}</div>
                </div>
              </div>
              <div className="tw-text-center tw-space-x-4 tw-my-3">
                <div className="tw-text-base tw-font-semibold tw-text-gray-600">
                  Q{contents?.order}. {contents?.weekNumber}주차 {contents?.studyDay}요일
                </div>
              </div>
              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-1">
                  {contents?.isRepresentative === true && (
                    <span
                      type="button"
                      data-tooltip-target="tooltip-default"
                      className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-bold tw-px-3 tw-py-1 tw-rounded"
                    >
                      대표
                    </span>
                  )}
                </div>
                <div className="tw-col-span-11">
                  <span className="tw-font-bold tw-text-[18px] tw-text-black">{contents?.content}</span>
                </div>
              </div>

              <div className="tw-text-center tw-pt-2">
                {contents?.hashTags?.map((name, i) => (
                  <span key={i} className="tw-font-right tw-text-base tw-text-gray-400">
                    {' '}
                    #{name}
                  </span>
                ))}
              </div>

              <div className="tw-text-left tw-pt-3 tw-flex tw-items-center tw-gap-4">
                <span>
                  <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                  {contents?.activeCount}
                </span>
                <span>
                  <FavoriteBorderIcon className="tw-mr-1  tw-w-5" />
                  <span>{contents?.likeCount}</span>
                </span>
                <span>
                  <ContentCopyOutlinedIcon className="tw-mr-1  tw-w-5" />
                  <span>{contents?.answerCount}</span>
                </span>
              </div>
            </div>
            <div className="tw-my-9" />
            <div>
              <div className="tw-grid tw-grid-cols-6 tw-gap-4 tw-items-center tw-justify-center">
                <div className="tw-col-span-4">
                  <div className="tw-text-black tw-font-bold tw-text-2xl">퀴즈답변 {totalElements}</div>
                </div>
                <div className="tw-col-span-2">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label=""
                    variant="outlined"
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        searchKeyworld((e.target as HTMLInputElement).value);
                      }
                    }}
                    InputProps={{
                      style: { height: '43px' },
                      startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                    }}
                  />
                </div>
              </div>

              {answerContents.map((item, index) => {
                return (
                  <CommunityCard
                    key={index}
                    board={item}
                    // writer={memberSample}
                    className={cx('reply-container__item')}
                    // memberId={memberId}
                    // onPostDeleteSubmit={onPostDeleteSubmit}
                  />
                );
              })}

              <div className="tw-flex tw-justify-center tw-mt-10">
                <Pagination count={totalPage} page={page} onChange={handlePageChange} />
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="tw-bg-gray-50 tw-rounded-lg tw-h-[1260px] tw-p-5 tw-text-black ">
              <div>
                <div className="tw-font-bold tw-text-base tw-pb-5">이달의 메이커</div>
                <div className="tw-bg-white tw-p-5 tw-rounded-md">
                  {rankContents?.maker ? (
                    <div className="tw-grid tw-grid-cols-4 tw-gap-4 ">
                      <div className="tw-col-span-1  tw-flex tw-flex-col tw-items-center tw-justify-center">
                        <img
                          className="tw-w-12 tw-h-12 tw-ring-1 tw-rounded-full"
                          src={rankContents?.maker?.profileImageUrl}
                          alt=""
                        />
                        <div className="tw-py-3 tw-text-base tw-font-semibold tw-text-black">
                          <div>{rankContents?.maker?.nickname}</div>
                        </div>
                      </div>
                      <div className="tw-col-span-3 tw-font-bold tw-text-black tw-flex tw-flex-col tw-items-center tw-justify-center">
                        <div>
                          이번달 등록 질문 수 :{' '}
                          <span className="tw-text-blue-600">{rankContents?.maker?.madeQuizCount}개</span>
                        </div>
                        <div>
                          받은 총 좋아요 수 :{' '}
                          <span className="tw-text-blue-600">{rankContents?.maker?.receivedLikeCount}개</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>데이터가 없습니다.</div>
                  )}
                  <div>
                    {rankContents?.maker?.quizzes?.map((item, index) => {
                      return (
                        <div key={index} className="tw-py-3 tw-text-sm">
                          <div>
                            {index + 1}. {item?.content}
                          </div>
                          <div className="tw-flex tw-items-center tw-gap-4">
                            <span>
                              <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                              {item?.answerCount}
                            </span>
                            <span>
                              <StarBorderIcon className="tw-mr-1  tw-w-5" />
                              <span>{item?.likeCount}</span>
                            </span>
                            <span>
                              <FavoriteBorderIcon className="tw-mr-1  tw-w-5" />
                              <span>{item?.activeCount}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div>
                <div className="tw-font-bold tw-text-base tw-py-5">이달의 퀴즈</div>
                <div className="tw-bg-white tw-p-5 tw-py-2 tw-rounded-md">
                  {rankContents?.quizzes?.map((item, index) => {
                    return (
                      <div key={index} className="tw-py-3 tw-text-sm">
                        <div>
                          {index + 1}. {item?.content}
                        </div>
                        <div className="tw-flex tw-items-center tw-gap-4">
                          <span>
                            <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                            {item?.answerCount}
                          </span>
                          <span>
                            <StarBorderIcon className="tw-mr-1  tw-w-5" />
                            <span>{item?.likeCount}</span>
                          </span>
                          <span>
                            <FavoriteBorderIcon className="tw-mr-1  tw-w-5" />
                            <span>{item?.activeCount}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="tw-font-bold tw-text-base tw-py-5">이달의 클럽</div>
                <div className="tw-bg-white tw-p-5 tw-py-2 tw-rounded-md">
                  {rankContents?.clubs?.map((item, index) => {
                    return (
                      <div key={index} className="tw-py-3 tw-text-sm ">
                        <div className="tw-grid tw-grid-cols-4 tw-gap-4 tw-flex tw-items-center tw-justify-center">
                          <div className="tw-col-span-1  tw-flex tw-flex-col ">
                            <img className="tw-w-12 tw-h-12 tw-rounded-md" src={item?.clubImageUrl} alt="" />
                          </div>
                          <div className="tw-col-span-3  tw-text-black ">
                            <div>
                              <span className="tw-text-gray-400">{item?.recommendJobNames?.toString()}</span>
                            </div>
                            <div>
                              <span className="tw-font-bold">{item?.clubName}</span>
                            </div>
                            <div>
                              <span className=" tw-text-sm">
                                {item?.clubLeaderNickname} | 평균실행률 : {item?.averageProgressPercentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default QuizAnswersRoundDetailTemplate;
