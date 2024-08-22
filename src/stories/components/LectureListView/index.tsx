// QuizClubDetailInfo.jsx
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

/** import pagenation */
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// import { useMyClubList } from 'src/services/seminars/seminars.queries';

/**icon */
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SettingsIcon from '@mui/icons-material/Settings';

import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';

import { CommunityCard } from 'src/stories/components';
import { Button, Typography, Profile, Modal, ArticleCard } from 'src/stories/components';
const cx = classNames.bind(styles);

//comment
import { useLectureQAInfo } from 'src/services/quiz/quiz.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';

const LectureListView = ({ border, id }) => {
  const router = useRouter();
  const { clubStudySequence } = router.query;
  console.log('clubStudySequence', id, clubStudySequence);

  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
  // const [activeTab, setActiveTab] = useState('myQuiz');
  const [activeTab, setActiveTab] = useState('community');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [myClubList, setMyClubList] = useState<any>([]);
  const [quizList, setQuizList] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState(id);
  const [selectedClub, setSelectedClub] = useState<any>(id);
  const [sortType, setSortType] = useState('ASC');
  const [isPublished, setIsPublished] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [params, setParams] = useState<any>({ id: '225', page });
  const [myClubParams, setMyClubParams] = useState<any>({
    clubSequence: id,
    clubStudySequence: clubStudySequence,
    questionStatuses: '',
    page,
  });

  console.log('myClubParams', myClubParams);

  // 퀴즈클럽 리스트
  // const { isFetched: isContentFetched, refetch: refetchMyClub } = useMyClubList({}, data => {
  //   setMyClubList(data?.data?.contents || []);
  // });

  const { isFetched: isParticipantListFetched, data } = useLectureQAInfo(myClubParams, data => {
    console.log('first get data', data);
    setQuizList(data?.contents || []);
    setTotalPage(data?.totalPages);
    // setSelectedClub(data?.contents[0].clubSequence);
    setTotalElements(data?.totalElements);
    console.log(data);
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useDidMountEffect(() => {
    setMyClubParams({
      clubSequence: selectedClub,
      sortType: sortType,
      page: page,
      isPublished: isPublished,
    });
  }, [sortType, page, selectedClub]);

  const handleQuizChange = event => {
    const value = event.target.value;
    setSelectedValue(value);
    setSelectedClub(value);
    setIsPublished('');
    setSortType('ASC');
  };

  const handleChangeQuiz = event => {
    if (event.target.value === '') {
      setSortType('');
      setIsPublished('true');
    } else {
      setIsPublished('');
      setSortType(event.target.value);
    }
  };

  return (
    <div className={`tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white ${borderStyle}`}>
      <div className="tw-pt-[35px]">
        <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden border-t-0 border-r-0 border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">강의클럽</p>
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
              강의 상세보기
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
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">Q & A</p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              Q&A 보기
            </p>
          </div>
        </div>
        <Divider className="tw-mb-5" />
        <div className="tw-flex tw-items-center tw-mt-6">
          <div className="tw-w-full tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] border tw-p-6 tw-rounded-lg">
            강의명 임베디드 [전공선택] 3학년 화요일 A반
          </div>

          {/* <select
            className="tw-h-14 form-select block w-full tw-bg-gray-100 tw-text-red-500 tw-font-bold tw-px-8"
            onChange={handleQuizChange}
            value={selectedValue}
            aria-label="Default select example"
          >
            {isContentFetched &&
              myClubList?.map((session, idx) => {
                return (
                  <option
                    key={idx}
                    className="tw-w-20 tw-bg-[#f6f7fb] tw-items-center tw-flex-shrink-0 border-left border-top border-right tw-rounded-t-lg tw-cursor-pointer"
                    value={session?.clubSequence}
                  >
                    퀴즈클럽 : {session?.clubName}
                  </option>
                );
              })}
          </select> */}
        </div>
        <div className="tw-text-2xl tw-text-black  tw-font-bold tw-mt-6">회차 정보</div>
        <Divider className="tw-py-3 tw-mb-3" />
        <div className="tw-text-black tw-my-5">
          <div className="tw-text-lg tw-font-medium tw-py-3">1회차 (06월 05일)</div>
          <div className="tw-text-lg tw-font-medium tw-py-3">
            강의URL: https://www.sejongonlineclass/lecture10/chapter1
          </div>
        </div>
        <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg">
          <div className={cx('content-wrap')}>
            <div className={cx('', 'tw-mt-10')}>
              <Grid container direction="row" alignItems="center" rowSpacing={0}>
                <Grid
                  container
                  item
                  justifyContent="flex-start"
                  xs={6}
                  sm={10}
                  className="tw-text-xl tw-text-black tw-font-bold"
                >
                  질의응답내역 ({totalElements})
                </Grid>

                <Grid container justifyContent="flex-end" item xs={6} sm={2} style={{ textAlign: 'right' }}>
                  <Pagination
                    count={totalPage}
                    size="small"
                    siblingCount={0}
                    page={page}
                    renderItem={item => (
                      <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                    )}
                    onChange={handlePageChange}
                  />
                </Grid>
              </Grid>
              <Divider className="tw-py-3 tw-mb-5" />
              <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6  tw-my-5">
                <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-3">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                    정렬 :
                  </p>

                  <RadioGroup value={sortType} onChange={handleChangeQuiz} row>
                    <FormControlLabel
                      value="ASC"
                      control={
                        <Radio
                          sx={{
                            color: '#ced4de',
                            '&.Mui-checked': { color: '#e11837' },
                          }}
                          icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                          checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                        />
                      }
                      label={
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                          모두보기
                        </p>
                      }
                    />
                    <FormControlLabel
                      value="DESC"
                      control={
                        <Radio
                          sx={{
                            color: '#ced4de',
                            '&.Mui-checked': { color: '#e11837' },
                          }}
                          icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                          checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                        />
                      }
                      label={
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                          강의자료에서 답변
                        </p>
                      }
                    />

                    <FormControlLabel
                      value=""
                      control={
                        <Radio
                          sx={{
                            color: '#ced4de',
                            '&.Mui-checked': { color: '#e11837' },
                          }}
                          icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                          checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                        />
                      }
                      label={
                        <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                          일반 서치 답변
                        </p>
                      }
                    />
                  </RadioGroup>
                </div>
              </div>
              {quizList.map((item, index) => {
                return (
                  <div className="" key={index}>
                    <div className="tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 tw-py-1 tw-rounded-xl tw-my-5">
                      <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                        <img className="tw-w-10 tw-h-10 border tw-rounded-full" src={item?.maker?.profileImageUrl} />
                        <div className="tw-text-xs tw-text-left tw-text-black">{item?.maker?.nickname}</div>
                      </div>
                      <div className="tw-flex-auto tw-px-5 tw-w-3/12">
                        <div className={`tw-font-medium ${item?.isPublished ? 'tw-text-black' : ' tw-text-gray-400'}`}>
                          {item?.question}
                        </div>
                      </div>
                      <div className="tw-pr-4">
                        <button
                          onClick={() => {
                            router.push(
                              {
                                pathname: `/quiz-answers/${item?.clubSequence}`,
                                query: {
                                  publishDate: item?.publishDate,
                                },
                              },
                              `/quiz-answers/${item?.clubSequence}`,
                            );
                          }}
                          type="button"
                          disabled={!item?.isPublished}
                          data-tooltip-target="tooltip-default"
                          className="tw-bg-black tw-text-white max-lg:tw-w-[60px] tw-text-base tw-font-medium tw-px-3 tw-py-2 tw-rounded"
                        >
                          추가 질문하기
                        </button>
                      </div>
                    </div>
                    <div className="tw-flex border tw-border tw-px-4 tw-py-5 tw-rounded-lg tw-mt-3">
                      <div className="tw-w-1/12 tw-text-lg tw-font-medium  tw-flex tw-items-start tw-justify-center">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 relative"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <path
                            d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                            stroke="#9CA5B2"
                            stroke-width="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="tw-w-1/12 tw-text-base tw-text-black  tw-font-bold  ">AI답변 : </div>
                      <div className="tw-text-base tw-text-black ">
                        (강의자료) EAI는 엔터프라이즈 어플리케이션 인테그레이션의 약자입니다. 시스템이 서로 얽히고
                        복잡해지면서 통제가 잘 안되는 상황이 발생하여 이런 문제를 해결하기 위해 등장한 솔루션이 바로 EAI
                        입니다.{' '}
                      </div>
                    </div>
                    <div className="tw-flex border tw-border tw-px-4 tw-py-5 tw-rounded-lg tw-mt-5">
                      <div className="tw-w-1/12 tw-text-lg tw-font-medium  tw-flex tw-items-start tw-justify-center">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 relative"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <path
                            d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                            stroke="#9CA5B2"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="tw-w-[120px] tw-text-base tw-text-black  tw-font-bold tw-text-blue-700 ">
                        교수답변 :{' '}
                      </div>
                      <div className="tw-text-base tw-text-black ">
                        EAI는 엔터프라이즈 어플리케이션 인테그레이션의 약자입니다. 시스템이 서로 얽히고 복잡해지면서
                        통제가 잘 안되는 상황이 발생하여 이런 문제를 해결하기 위해 등장한 솔루션이 바로 EAI 입니다.
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} title="퀴즈풀러가기" maxWidth="900px">
        <div className={cx('seminar-check-popup')}>
          <div className={cx('mb-5')}>
            <span className={cx('text-bold', 'tw-text-xl', 'tw-font-bold')}>가입 신청이 완료되었습니다!</span>
          </div>
          <div>가입 신청 후 클럽장 승인이 완료될때까지 기다려주세요!</div>
          <div>승인 완료 후 MY페이지나 퀴즈클럽 페이지 상단에서 가입된 클럽을 확인하실 수 있습니다.</div>
          <br></br>
          <br></br>
          <div className="tw-mt-5">
            <Button className="tw-mr-5" color="red" label="확인" size="modal" onClick={() => setIsModalOpen(false)} />
            {/* <Button
              color="primary"
              label="연락처 입력하러가기"
              size="modal"
              onClick={() =>
                router.push(
                  {
                    pathname: '/profile',
                    query: { isOpenModal: true, beforeQuizSequence: id },
                  },
                  '/profile',
                )
              }
            /> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LectureListView;
