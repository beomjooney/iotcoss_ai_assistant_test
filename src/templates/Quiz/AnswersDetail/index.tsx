import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import { Button, CommunityCard } from 'src/stories/components';
import { RecommendContent } from 'src/models/recommend';
import {
  useEncoreSeminar,
  useParticipantCancelSeminar,
  useParticipantSeminar,
} from 'src/services/seminars/seminars.mutations';
import { useSessionStore } from 'src/store/session';
import Grid from '@mui/material/Grid';
import router from 'next/router';
import { useQuizAnswerDetail, useQuizSolutionDetail } from 'src/services/quiz/quiz.queries';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

/** like */
import {
  useSaveLike,
  useDeleteLike,
  useSaveReply,
  useDeleteReply,
  useDeletePost,
} from 'src/services/community/community.mutations';

/** import icon */
import SearchIcon from '@mui/icons-material/Search';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
/** import pagenation */
import Pagination from '@mui/material/Pagination';

const cx = classNames.bind(styles);
export interface QuizAnswersDetailTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizAnswersDetailTemplate({ id }: QuizAnswersDetailTemplateProps) {
  const { user } = useStore();
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [answerContents, setAnswerContents] = useState<RecommendContent[]>([]);
  const { memberId, logged } = useSessionStore.getState();
  const [page, setPage] = useState(1);
  const [keyWorld, setKeyWorld] = useState('');
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [params, setParams] = useState<any>({ id, page });
  const [isLiked, setIsLiked] = useState(false);

  const { isFetched: isParticipantListFetched, data } = useQuizSolutionDetail(id, data => {
    setContents(data);
  });
  const { isFetched: isQuizAnswerListFetched } = useQuizAnswerDetail(params, data => {
    console.log('-------------------------------------');
    setAnswerContents(data?.contents);
    setTotalElements(data?.totalElements);
    setTotalPage(data?.totalPages);
  });

  const { mutate: onCancelParticipant } = useParticipantCancelSeminar();

  let tabPannelRefs = [];

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleCancelParticipant = () => {
    if (!logged) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!user?.phoneNumber || user?.phoneNumber?.length === 0) {
      alert('마이커리어>회원정보에 휴대전화 등록 후 취소 가능 합니다.');
      return;
    }

    onCancelParticipant({ seminarId: id, memberId });
    setIsModalOpen(false);
    setIsModalCancelOpen(false);
    setApplicationButton(
      <Button label="멘토 세미나 참여 신청하기" size="large" onClick={() => setIsModalOpen(true)} />,
    );
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

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  useEffect(() => {
    setParams({
      // ...params,
      id,
      page,
      keyword: keyWorld,
    });
  }, [page, keyWorld]);

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <div className="tw-py-[60px]">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={9} className="tw-font-bold tw-text-3xl tw-text-black">
              퀴즈클럽 {'>'} 클럽 상세보기 {'>'} 답변 전체보기
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                onClick={() => router.back()}
                type="button"
                className="tw-text-white tw-bg-blue-500  tw-focus:ring-4  tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
              >
                뒤로가기
              </button>
            </Grid>
          </Grid>
        </div>
        <Divider className="tw-py-2" />

        <div className="tw-py-4 tw-text-sm tw-font-normal tw-text-gray-500 ">
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
          {contents?.hashTags?.map((name, i) => (
            <span
              key={i}
              className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-gray-700"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="tw-text-black tw-font-bold tw-text-2xl tw-py-4">{contents?.clubName}</div>

        <div>
          <div className="tw-bg-gray-50 tw-rounded-lg tw-px-8 tw-py-5 tw-text-black tw-grid tw-grid-cols-12">
            <div className="tw-col-span-1">
              <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">Q{contents?.order}.</div>
              <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                {contents?.weekNumber} 회차 ({contents?.studyDay})
              </div>
            </div>
            <div className="tw-col-span-1 tw-flex tw-items-center ">
              <div className="">
                {contents?.isRepresentative === true && (
                  <button
                    type="button"
                    data-tooltip-target="tooltip-default"
                    className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                  >
                    대표
                  </button>
                )}
                {contents?.isRepresentative === false && (
                  <button
                    type="button"
                    data-tooltip-target="tooltip-default"
                    className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                  >
                    대표
                  </button>
                )}
              </div>
            </div>
            <div className="tw-col-span-8 tw-flex tw-items-center ">
              <span className="tw-font-right tw-text-base tw-text-black">{contents?.content}</span>
            </div>
            <div className="tw-col-span-2 tw-flex tw-items-center tw-justify-end">
              <div className="tw-flex tw-items-center tw-gap-4">
                <span>
                  <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                  {contents?.activeCount}
                </span>
                <span>
                  {isLiked ? (
                    <FavoriteIcon className="tw-mr-1  tw-w-5" color="primary" />
                  ) : (
                    <FavoriteBorderIcon className="tw-mr-1  tw-w-5" color="disabled" />
                  )}
                  <span>{contents?.likeCount}</span>
                </span>
                <span>
                  <ContentCopyOutlinedIcon className="tw-mr-1  tw-w-5" />
                  <span>{contents?.answerCount}</span>
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="tw-mt-9 tw-grid tw-grid-cols-6 tw-gap-4 tw-items-center tw-justify-center">
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
          </div>
          {answerContents.map((item, index) => {
            return <CommunityCard key={index} board={item} className={cx('reply-container__item')} />;
          })}
        </div>
        <div className="tw-flex tw-justify-center tw-mt-10">
          <Pagination count={totalPage} page={page} onChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
}

export default QuizAnswersDetailTemplate;
