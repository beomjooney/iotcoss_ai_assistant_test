import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { useStore } from 'src/store';
import { User } from 'src/models/user';
import { useMonthlyRanking, useQuizzesAnswers, quizzesAnswersParamProps } from 'src/services/monthly/monthly.queries';
import { Toggle } from 'src/stories/components';
import { paramProps } from 'src/services/seminars/seminars.queries';
import { MonthlyMakerQuizzesResponse, MonthlyRankingResponse, QuizzesAnswersResponse } from 'src/models/monthly';

import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Avatar from '@mui/material/Avatar';

const cx = classNames.bind(styles);

export function MonthlyMakerTemplate() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page });
  const [keyWord, setKeyWord] = useState('');
  const { user, setUser } = useStore();
  const [userInfo, setUserInfo] = useState<User>(user);
  const [monthlyRankingContents, setMonthlyRankingContents] = useState<MonthlyRankingResponse>();
  const [monthlyMakerQuizzesContents, setMonthlyMakerQuizzesContents] = useState<MonthlyMakerQuizzesResponse>();
  let [makerQuizSequence, setMakerQuizSequence] = useState<number>(0);
  let [quizzesAnswersContents, setQuizzesAnswersContents] = useState<quizzesAnswersParamProps>();
  const [totalElements, setTotalElements] = useState(0);

  makerQuizSequence = 17;

  // 퀴즈 데이터
  const { isFetched: isMonthlyRankingFetched } = useMonthlyRanking(data => {
    setMonthlyRankingContents(data);
    setMakerQuizSequence(data.maker.quizzes[0].quizSequence);
  });

  // 답변 데이터
  const { isFetched: isQuizzesAnswersFetched, refetch } = useQuizzesAnswers(makerQuizSequence, params, data => {
    setQuizzesAnswersContents(data?.contents);
    setTotalPage(data?.totalPages);
    setTotalElements(data?.totalElements);
  });

  useEffect(() => {
    setParams({
      page,
    });
  }, [page]);

  useEffect(() => {
    if (makerQuizSequence > 0) refetch();
  }, [makerQuizSequence]);

  console.log(quizzesAnswersContents);
  //console.log(totalElements);
  //console.log(totalPage);
  //console.log(monthlyRankingContents);

  const handleIconButton = (event: React.MouseEvent<HTMLElement>) => {};

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <div className="tw-py-[60px]">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={3} className="tw-font-bold tw-text-3xl tw-text-black">
              라운지 {'>'} 이달의 메이커
            </Grid>
            <Grid item xs={6} className="tw-font-semi tw-text-base tw-text-black">
              <div>이달에 질문을 가장 많이 만들어 성장 동력을 제공한 메이커에요!</div>
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                className="white border bordtw-text-blue-600 tw-bg-er-primary tw-font-bold tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                type="button"
                onClick={() => router.back()}
              >
                뒤로가기
              </button>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className="content-wrap">
        <div className="tw-bg-gray-100">
          <div className="container">
            <div className="tw-flex tw-gap-4 tw-py-10 tw-font-bold tw-text-black">
              <div className="tw-w-1/6">
                <img
                  className="tw-w-32 tw-h-32 tw-ring-1 tw-rounded-full"
                  src={monthlyRankingContents?.maker?.profileImageUrl}
                  alt=""
                />
              </div>
              <div className="tw-w-3/4">
                <div>
                  {monthlyRankingContents?.maker?.nickname}님
                  <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600">
                    개발
                  </span>
                  <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
                    레벨 3
                  </span>
                  <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-300 tw-text-sm tw-font-light tw-text-gray-600">
                    모바일개발자
                  </span>
                </div>
                {monthlyRankingContents?.maker?.jobGroupTypeName && (
                  <div className="tw-font-bold tw-text-base tw-text-black tw-mt-5">
                    {monthlyRankingContents?.maker?.jobGroupTypeName} | {monthlyRankingContents?.maker?.jobTypeName} |
                    {monthlyRankingContents?.maker?.experienceYears}년차
                  </div>
                )}
                {monthlyRankingContents?.maker?.jobGroupTypeName && (
                  <div className="tw-py-2">
                    <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-bg-black tw-text-white">
                      GO
                    </span>
                    <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-bg-black tw-text-white">
                      Spring
                    </span>
                  </div>
                )}
                <div className="tw-mt-3 tw-font-light tw-text-base tw-text-gray-500">
                  {monthlyRankingContents?.maker?.introductionMessage}
                </div>
              </div>
              <div className="tw-w-1/4">
                <div className="tw-col-span-2 tw-text-right">
                  <div>
                    <span className="tw-inline-block p-2 tw-bg-white tw-rounded-lg tw-w-[200px]">
                      <div className="tw-border-4 tw-text-base tw-pr-10">이번달 등록 질문 수</div>
                      <div className="tw-leading-9 tw-text-blue-600 tw-text-lg tw-text-right">
                        {monthlyRankingContents?.maker?.madeQuizCount}개
                      </div>
                    </span>
                  </div>
                  <div className="tw-pt-2">
                    <span className="tw-inline-block p-2 tw-bg-white tw-rounded-lg tw-w-[200px]">
                      <div className="tw-border-4 tw-text-base tw-pr-10">받은 총 좋아요 수</div>
                      <div className="tw-leading-9 tw-text-blue-600 tw-text-lg tw-text-right">
                        {monthlyRankingContents?.maker?.receivedLikeCount}개
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cx('container')}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <div className="tw-flex tw-gap-5 tw-pt-10">
            {monthlyRankingContents?.maker?.quizzes?.map((values, index) => (
              <Toggle
                name={`퀴즈 ${index + 1}`}
                label={`퀴즈 ${index + 1}`}
                key={values?.quizSequence}
                value={values?.quizSequence}
                variant="small"
                type="tabButton"
                checked={active === index}
                isActive
                onChange={() => {
                  setActive(index);
                  setMakerQuizSequence(values.quizSequence);
                  setPage(1);
                }}
                className={cx('fixed-width')}
              />
            ))}
          </div>
        </Box>

        {monthlyRankingContents?.maker?.quizzes?.map(
          (values, index: number) =>
            active === index && (
              <div>
                <div className="tw-pt-10" key={values.quizSequence}>
                  {values?.recommendJobGroupNames?.map(jobGroupNamesValues => (
                    <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600">
                      {jobGroupNamesValues}
                    </span>
                  ))}

                  {values?.recommendLevels?.map(recommendLevelsValues => (
                    <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
                      레벨 {recommendLevelsValues}
                    </span>
                  ))}

                  {values?.recommendJobNames?.map(recommendJobNamesValues => (
                    <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-300 tw-text-sm tw-font-light tw-text-gray-600">
                      {recommendJobNamesValues}
                    </span>
                  ))}
                </div>

                <article>
                  <div className={cx('quiz-area tw-pt-5')} key={values?.quizSequence}>
                    <div className={cx('content-wrap tw-font-bold')}>
                      <div className="tw-flex p-3 tw-m-1 tw-px-3 tw-py-0.5 tw-rounded tw-bg-gray-100">
                        <div className="tw-w-3/4">
                          <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-blue-600 tw-border-blue-600">
                            메이커의 퀴즈 {index + 1}
                          </span>
                          <span className="tw-flex-auto tw-pl-10 tw-text-black tw-col-span-9">{values?.content}</span>
                        </div>
                        <div className="tw-w-1/4 tw-text-right">
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            size="small"
                            aria-haspopup="true"
                            onClick={e => handleIconButton(e)}
                          >
                            <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                            <span className="tw-text-sm">{values?.answerCount ?? 0}</span>
                          </IconButton>
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            size="small"
                            aria-haspopup="true"
                            onClick={e => handleIconButton(e)}
                          >
                            <FavoriteBorderIcon className="tw-mr-1 tw-w-5" />
                            <span className="tw-text-sm">{values?.likeCount ?? 0}</span>
                          </IconButton>

                          <IconButton
                            aria-label="more"
                            id="long-button"
                            size="small"
                            aria-haspopup="true"
                            onClick={e => handleIconButton(e)}
                          >
                            <ContentCopyIcon className="tw-mr-1 tw-w-5" />
                            <span className="tw-text-sm">{values?.activeCount ?? 0}</span>
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ),
        )}

        <div>
          <article>
            <div className={cx('answer-area tw-pt-5')}>
              <div className={cx('content-wrap tw-rounded tw-bg-white border')}>
                <div className="tw-flex p-3 tw-m-1 tw-px-3 tw-py-0.5">
                  <div className="tw-w-1/6">
                    <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-text-sm tw-font-light">
                      20.06.01
                    </span>
                  </div>
                  <div className="tw-w-3/4">
                    <span className="tw-flex tw-text-black tw-text-sm">
                      <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                      <span className="tw-leading-9 tw-pl-2 tw-font-bold">개발열공러님</span>
                    </span>
                  </div>
                  <div className="tw-w-3/4 tw-text-right">
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      size="small"
                      aria-haspopup="true"
                      onClick={e => handleIconButton(e)}
                    >
                      <AssignmentOutlinedIcon className="tw-mr-1 tw-w-5" />
                    </IconButton>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      size="small"
                      aria-haspopup="true"
                      onClick={e => handleIconButton(e)}
                    >
                      <StarBorderIcon className="tw-mr-1 tw-w-5" />
                    </IconButton>

                    <IconButton
                      aria-label="more"
                      id="long-button"
                      size="small"
                      aria-haspopup="true"
                      onClick={e => handleIconButton(e)}
                    >
                      <ContentCopyIcon className="tw-mr-1 tw-w-5" />
                    </IconButton>
                  </div>
                </div>
                <div className="tw-flex p-3 tw-m-1 tw-px-3 tw-py-0.5">
                  <span className="tw-flex tw-text-black tw-text-sm tw-pl-[120px]">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet, possimus! Aliquid ipsum consectetur
                    cumque magni quo expedita, animi ex veritatis eaque aspernatur ad, laudantium dignissimos fugit
                    dicta dolore! Eos, odio! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab quos earum
                    vero incidunt necessitatibus porro molestiae magnam, sit corrupti dolorem nulla repellat facere
                    tempora ipsa! Assumenda ipsa temporibus sapiente atque. Lorem ipsum, dolor sit amet consectetur
                    adipisicing elit. Aperiam expedita neque ipsum magni quasi, perspiciatis nostrum ipsa sed, eaque
                    itaque odio doloribus accusantium! Omnis perferendis a laboriosam quam architecto quae? Lorem ipsum
                    dolor sit amet consectetur adipisicing elit. Consectetur, eum! Obcaecati corporis molestias maiores
                    quo id temporibus laudantium iste labore hic saepe. Delectus cumque cupiditate et fugiat quam, sint
                    tempora! Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam dicta at odit ipsa numquam?
                    Placeat, quidem excepturi quaerat, maxime voluptates aperiam suscipit incidunt illum recusandae
                    provident, quibusdam nemo ducimus veniam! Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptate iusto optio ratione, nulla molestias quasi accusantium odio architecto sint maiores
                    quibusdam magni, debitis saepe sed velit eveniet voluptatem ipsam laborum!
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* <article>
          <div className={cx('answer-area tw-p-[100px] tw-text-center')}>
            <span className="tw-font-bold tw-text-black">해당 퀴즈를 풀고 답변을 확인해보세요!</span>
          </div>
        </article> */}
      </div>
    </div>
  );
}

export default MonthlyMakerTemplate;
