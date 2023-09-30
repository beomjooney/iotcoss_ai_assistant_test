import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useStore } from 'src/store';
import QuizMyReply from 'src/stories/components/QuizMyReply';
import { Button, Toggle } from 'src/stories/components';
import {
  useEncoreSeminar,
  useOpenSeminar,
  useParticipantCancelSeminar,
  useParticipantSeminar,
} from 'src/services/seminars/seminars.mutations';
import { useSessionStore } from 'src/store/session';
import { useMemberInfo } from 'src/services/account/account.queries';
import { useStudyQuizOpponentBadgeList } from 'src/services/studyroom/studyroom.queries';

/** import pagenation */
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useMyQuiz, useQuizList, useQuizReply } from 'src/services/jobs/jobs.queries';
import { UseQueryResult } from 'react-query';

const cx = classNames.bind(styles);
export interface OpponentProfileTemplateProps {
  /** Member 아이디 */
  id?: any;
}

export function OpponentProfileTemplate({ id }: OpponentProfileTemplateProps) {
  const { user } = useStore();

  const { memberId, logged } = useSessionStore.getState();
  let [isLiked, setIsLiked] = useState(false);
  const [userInfo, setUserInfo] = useState<User>(user);
  const [active, setActive] = useState(0);
  const { isFetched: isUserInfo, refetch } = useMemberInfo(id, user => {
    setUserInfo(user);
  });

  /** get badge */
  const [badgePage, setBadgePage] = useState(1);
  const [badgeParams, setBadgeParams] = useState<paramProps>({ page: badgePage, isAchieved: true, memberUUID: id });
  const [badgeContents, setBadgeContents] = useState<RecommendContent[]>([]);
  const { isFetched: isQuizbadgeFetched, refetch: QuizRefetchBadge } = useStudyQuizOpponentBadgeList(
    badgeParams,
    data => {
      setBadgeContents(data.data.contents);
    },
  );

  /** my quiz */
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [myParams, setMyParams] = useState<paramProps>({ page, memberUUID: id });
  const { data: myQuizListData, refetch: refetchMyJob }: UseQueryResult<any> = useQuizList(myParams, data => {
    setTotalPage(data.totalPages);
  });
  console.log(myQuizListData);

  /** my quiz replies */
  const [quizPage, setQuizPage] = useState(1);
  const [quizTotalPage, setQuizTotalPage] = useState(1);
  const [myQuizParams, setMyQuizParams] = useState<paramProps>({ page: quizPage, memberUUID: id });
  const { data: myQuizReplyData }: UseQueryResult<any> = useQuizReply(myQuizParams, data => {
    console.log(data);
    setQuizTotalPage(data.totalPages);
  });

  return (
    <div className={cx('seminarseminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black max-lg:!tw-text-base">
              프로필
            </Grid>
            <Grid item xs={7} className="max-lg:tw-p-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-sm">
              나의 프로필을 완성하고 다양한 크루들과 교류해보세요.
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex"></Grid>
          </Grid>
        </div>
      </div>
      {isUserInfo && (
        <div className={cx('content-wrap')}>
          <div className="tw-bg-gray-100">
            <div className={cx('container')}>
              <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-py-10 tw-font-bold tw-text-black">
                <div className="tw-col-span-2">
                  <img className="tw-w-32 tw-h-32 tw-ring-1 tw-rounded-full" src={userInfo?.profileImageUrl} alt="" />
                </div>
                <div className="tw-col-span-10 tw-text-left  tw-flex tw-flex-col  tw-justify-start">
                  <div className=" tw-text-black">
                    <div className="tw-font-bold tw-text-xl tw-grid tw-items-center tw-grid-cols-6">
                      <div className="tw-col-span-4">
                        {userInfo?.nickname} 님
                        <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600">
                          {userInfo?.jobGroupName}
                        </span>
                        <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
                          {userInfo?.level} 레벨
                        </span>
                        <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-300 tw-text-sm tw-font-light tw-text-gray-600">
                          {userInfo?.jobName}
                        </span>
                      </div>
                      <div className="tw-col-span-2 tw-text-right">
                        <span className="tw-inline-flex tw-item-right">
                          <div className="tw-flex tw-justify-between tw-mt-2 tw-gap-2"></div>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="tw-font-bold tw-text-base tw-text-black tw-mt-5">
                    {userInfo?.careers?.[userInfo?.careers?.length - 1]?.companyName} |
                    {userInfo?.careers?.[userInfo?.careers?.length - 1]?.job}
                  </div>
                  <div className="tw-py-2">
                    {userInfo?.customSkills?.map((name, i) => (
                      <span
                        key={i}
                        className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-bg-black tw-text-white"
                      >
                        {name}
                      </span>
                    ))}
                  </div>

                  <div className="tw-mt-3 tw-font-light tw-text-base tw-text-gray-500">
                    {userInfo?.introductionMessage}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('container')}>
            <div className="tw-py-10 tw-text-xl tw-text-black tw-font-bold">
              나의 보유포인트 : {userInfo?.points} point
            </div>
          </div>
        </div>
      )}
      <div className={cx('container')}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <div className="tw-flex tw-gap-5">
            <Toggle
              label="보유배지"
              name="보유배지"
              value=""
              variant="small"
              checked={active === 0}
              isActive
              type="tabButton"
              onChange={() => {
                setActive(0);
              }}
              className={cx('fixed-width')}
            />
            <Toggle
              label="만든퀴즈"
              name="만든퀴즈"
              value=""
              variant="small"
              checked={active === 1}
              isActive
              type="tabButton"
              onChange={() => {
                setActive(1);
                setMyParams({
                  page,
                  memberUUID: id,
                });
                setPage(1);
              }}
              className={cx('fixed-width')}
            />
            <Toggle
              label="작성글"
              name="작성글"
              value=""
              variant="small"
              checked={active === 2}
              isActive
              type="tabButton"
              onChange={() => {
                setActive(2);
                setMyQuizParams({
                  page: quizPage,
                  memberUUID: id,
                });
                setQuizPage(1);
              }}
              className={cx('fixed-width')}
            />
          </div>
        </Box>
        <Divider className="tw-my-10 tw-border tw-bg-['#efefef']" />
        {active == 0 && (
          <div>
            <div className="tw-grid tw-grid-cols-8 tw-gap-4">
              {badgeContents.map((item, index) => (
                <div key={index} className="tw-text-center">
                  <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
                    <img
                      className="tw-object-cover tw-h-[80px] "
                      src={`${process.env.NEXT_PUBLIC_GENERAL_URL}/assets/images/badge/${item?.badgeId}.png`}
                      alt=""
                    />
                  </div>
                  <div className="tw-text-sm tw-text-black tw-font-bold">{item?.name}</div>
                  <div className="tw-text-sm tw-text-black tw-line-clamp-1">{item?.description}</div>
                  <div className="tw-text-sm tw-text-black">{item?.achievementAt?.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {active == 1 && (
          <div>
            {myQuizListData?.contents.map((item, index) => (
              <div key={`admin-quiz-${index}`} className="tw-flex tw-pb-5">
                <div className="tw-p-4 tw-border border tw-w-full tw-rounded-lg">
                  <div className="tw-flex tw-w-full tw-items-center"></div>
                  <div className="tw-flex  tw-items-center">
                    <div className="tw-flex-auto">
                      <div className="tw-font-medium tw-text-black">
                        <div className="tw-text-sm tw-font-normal tw-text-gray-500">
                          {item?.recommendJobGroupNames?.map((name, i) => (
                            <span
                              key={i}
                              className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600"
                            >
                              {name}
                            </span>
                          ))}
                          <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
                            {item?.recommendLevels?.sort().join(',')}레벨
                          </span>
                          {item?.recommendJobNames?.map((name, i) => (
                            <span
                              key={i}
                              className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-100 tw-text-sm tw-font-light tw-text-gray-600"
                            >
                              {name}
                            </span>
                          ))}
                          {item?.hashTags?.map((name, i) => (
                            <span
                              key={i}
                              className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-gray-700"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="tw-text-gray-400 tw-text-sm ">{item.createdAt}</div>
                  </div>
                  <div className="tw-flex  tw-items-center py-2">
                    <div className="tw-flex-auto">
                      <div className="tw-font-medium tw-text-black tw-text-base tw-line-clamp-1">{item.content}</div>
                    </div>
                    {/* <div className="">{item.memberName}</div> */}
                  </div>
                  <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-1 tw-text-sm tw-font-bold tw-text-black">아티클</div>
                    <div className="tw-col-span-9 tw-text-sm tw-text-gray-600  tw-line-clamp-1">{item.articleUrl}</div>
                    <div className="tw-col-span-2 tw-text-sm tw-text-right">
                      댓글 : {item.activeCount} 답변 : {item.answerCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="tw-flex tw-justify-center">
              <Pagination page={page} setPage={setPage} total={totalPage} />
            </div>
          </div>
        )}
        {active == 2 && (
          <div>
            {myQuizReplyData?.contents?.map((item, index) => {
              return (
                <QuizMyReply
                  key={index}
                  board={item}
                  // writer={memberSample}
                  className={cx('reply-container__item')}
                  // memberId={memberId}
                  // onPostDeleteSubmit={onPostDeleteSubmit}
                />
              );
            })}
            <div className="tw-flex tw-justify-center">
              <Pagination page={quizPage} setPage={setQuizPage} total={quizTotalPage} />
            </div>
          </div>
        )}
        <article>
          <div className={cx('content-area')}>
            <section className={cx('content', 'flex-wrap-container')}>
              <Grid
                container
                direction="row"
                justifyContent="left"
                alignItems="center"
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              ></Grid>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}

export default OpponentProfileTemplate;
