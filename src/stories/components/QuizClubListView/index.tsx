import React, { useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useMyClubList } from 'src/services/seminars/seminars.queries';
import SettingsIcon from '@mui/icons-material/Settings';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { Button, Modal } from 'src/stories/components';
import router from 'next/router';
import { useQuizMyClubInfo } from 'src/services/quiz/quiz.queries';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
const cx = classNames.bind(styles);

const QuizClubListView = ({ border, id }) => {
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
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
  const [myClubParams, setMyClubParams] = useState<any>({
    clubSequence: id,
    sortType: 'ASC',
    isPublished: '',
    page,
  });
  const [myClubSubTitleParams, setMyClubSubTitleParams] = useState<any>({
    clubSequence: id,
    page,
    clubType: '0100',
    size: 100,
  });

  // 퀴즈클럽 리스트
  const { isFetched: isContentFetched } = useMyClubList(myClubSubTitleParams, data => {
    setMyClubList(data?.data?.contents || []);
  });

  const { isFetched: isParticipantListFetched, data } = useQuizMyClubInfo(myClubParams, data => {
    console.log('first get data', data);
    setQuizList(data?.contents || []);
    setTotalPage(data?.totalPages);
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
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">퀴즈클럽</p>
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
              퀴즈클럽 전체보기
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              클럽 상세보기
            </p>
          </div>
        </div>

        <Divider className="tw-mb-5" />
        <div className="tw-flex tw-items-center tw-mt-6">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={11.1} className="tw-font-bold tw-text-xl">
              <select
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
              </select>
            </Grid>

            <Grid item xs={0.9} justifyContent="flex-end" className="tw-flex">
              <div className="">
                <button
                  type="button"
                  onClick={() => router.push(`/manage-quiz-club/${selectedValue}`)}
                  className="tw-h-14  tw-text-black tw-bg-[#CED4DE] border tw-font-medium tw-rounded-md tw-text-sm tw-px-6 tw-py-2 "
                >
                  <SettingsIcon className="tw-bg-[#CED4DE] tw-text-white" />
                </button>
              </div>
            </Grid>
          </Grid>
        </div>
        <div className="tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg">
          <div className={cx('content-wrap')}>
            <div className={cx('container', 'tw-mt-10')}>
              <Grid container direction="row" alignItems="center" rowSpacing={0}>
                <Grid
                  container
                  item
                  justifyContent="flex-start"
                  xs={6}
                  sm={10}
                  className="tw-text-xl tw-text-black tw-font-bold"
                >
                  퀴즈목록 ({totalElements || 0})
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
              <Divider className="tw-py-3 tw-mb-3" />
              <div className="tw-flex tw-justify-start tw-items-center tw-w-[1120px] tw-h-12 tw-gap-6">
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
                          오름차순
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
                          내림차순
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
                          진행중인 퀴즈만 보기
                        </p>
                      }
                    />
                  </RadioGroup>
                </div>
              </div>

              {quizList.length === 0 && (
                <div className={cx('tw-flex tw-justify-center tw-items-center tw-h-[70vh]')}>
                  <p className="tw-text-center tw-text-base tw-font-bold tw-text-[#31343d]">데이터가 없습니다.</p>
                </div>
              )}

              {quizList.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid
                      className="tw-pt-8"
                      key={index}
                      container
                      direction="row"
                      justifyContent="left"
                      alignItems="center"
                      rowSpacing={3}
                    >
                      <Grid item xs={12} sm={1}>
                        <div className={`tw-font-medium ${item?.isPublished ? 'tw-text-black' : ' tw-text-gray-400'}`}>
                          <div className="tw-flex-auto tw-text-center  tw-font-bold">Q{item?.order}.</div>
                          <div className="tw-flex-auto tw-text-center tw-text-sm   tw-font-bold">
                            {item?.publishDate?.slice(5, 10)}
                            {item?.dayOfWeek ? `(${item.dayOfWeek})` : ''}
                          </div>
                        </div>
                      </Grid>

                      <Grid item xs={12} sm={11}>
                        <div className="">
                          <div className="tw-bg-[#F6F7FB] tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1 tw-rounded-xl">
                            <div className="tw-w-1.5/12 tw-p-2 tw-flex tw-flex-col tw-items-center tw-justify-center">
                              <img
                                alt="Default_profile_image"
                                className="tw-w-10 tw-h-10 border tw-rounded-full"
                                src={item?.maker?.profileImageUrl}
                              />
                              <div className="tw-text-xs tw-text-left tw-text-black">{item?.maker?.nickname}</div>
                            </div>
                            <div className="tw-flex-auto tw-px-5 tw-w-3/12">
                              <div
                                className={`tw-font-medium ${
                                  item?.isPublished ? 'tw-text-black' : ' tw-text-gray-400'
                                }`}
                              >
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
                                        quizSequence: item?.quizSequence,
                                      },
                                    },
                                    `/quiz-answers/${item?.clubSequence}`,
                                  );
                                }}
                                type="button"
                                disabled={!item?.isPublished}
                                data-tooltip-target="tooltip-default"
                                className={`
                                ${
                                  item?.isPublished
                                    ? 'tw-bg-white border border-danger tw-text-black'
                                    : 'tw-bg-gray-200 tw-text-white'
                                }
                                max-lg:tw-w-[60px] tw-text-sm tw-font-medium tw-px-3 tw-py-1 tw-rounded`}
                              >
                                답변확인 및 채점하기 {'>'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </React.Fragment>
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
          <div>승인 완료 후 MY학습방이나 퀴즈클럽 페이지에서 가입된 클럽을 확인하실 수 있습니다.</div>
          <br></br>
          <br></br>
          <div className="tw-mt-5">
            <Button className="tw-mr-5" color="red" label="확인" size="modal" onClick={() => setIsModalOpen(false)} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizClubListView;
