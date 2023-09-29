import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Typography, Chip, ClubCard, CommunityCard } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useSeminarList, paramProps, useSeminarImageList } from 'src/services/seminars/seminars.queries';
import QuizArticleCard from 'src/stories/components/QuizArticleCard';
import Carousel from 'nuka-carousel';
import { ArticleEnum } from '../../config/types';
import { useContentJobTypes, useContentTypes, useJobGroups } from 'src/services/code/code.queries';
import Banner from '../../stories/components/Banner';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/system/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import { useSessionStore } from 'src/store/session';
import { useDeleteLike, useSaveLike } from 'src/services/community/community.mutations';
import { useMemberInfo } from 'src/services/account/account.queries';
import { User } from 'src/models/user';
import { useStudyQuizBadgeList } from 'src/services/studyroom/studyroom.queries';
import { useMyQuiz, useMyQuizReply } from 'src/services/jobs/jobs.queries';
import { UseQueryResult } from 'react-query';
import QuizMyReply from 'src/stories/components/QuizMyReply';
import { deleteCookie } from 'cookies-next';
const cx = classNames.bind(styles);

export function ProfileTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();
  const { logged } = useSessionStore.getState();
  const router = useRouter();
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [images, setSeminarImages] = useState<any[]>([]);
  const [recommendJobGroup, setRecommendJobGroup] = useState<any[]>([]);
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [jobGroup, setJobGroup] = useState([]);
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));
  const [recommendLevels, setRecommendLevels] = useState([]);
  let [isLiked, setIsLiked] = useState(false);
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();
  const [keyWorld, setKeyWorld] = useState('');

  /** get profile */
  const { user, setUser } = useStore();
  const [userInfo, setUserInfo] = useState<User>(user);
  const { memberId } = useSessionStore.getState();

  // console.log('memberId', memberId);

  const { isFetched: isUserInfo } = useMemberInfo(memberId, user => {
    setUserInfo(user);
    console.log(user);
  });

  /**logout */
  const handleLogout = async () => {
    deleteCookie('access_token');
    localStorage.removeItem('auth-store');
    localStorage.removeItem('app-storage');
    location.href = '/';
  };

  /** get badge */
  const [badgePage, setBadgePage] = useState(1);
  const [badgeParams, setBadgeParams] = useState<paramProps>({ page: badgePage, isAchieved: true });
  const [badgeContents, setBadgeContents] = useState<RecommendContent[]>([]);
  const { isFetched: isQuizbadgeFetched, refetch: QuizRefetchBadge } = useStudyQuizBadgeList(badgeParams, data => {
    setBadgeContents(data.data.contents);
  });

  /** my quiz */
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [myParams, setMyParams] = useState<paramProps>({ page });
  const { data: myQuizListData, refetch: refetchMyJob }: UseQueryResult<any> = useMyQuiz(myParams, data => {
    setTotalPage(data.totalPage);
  });

  /** my quiz replies */
  const [quizPage, setQuizPage] = useState(1);
  const [quizTotalPage, setQuizTotalPage] = useState(1);
  const [myQuizParams, setMyQuizParams] = useState<paramProps>({ page: quizPage });
  const { data: myQuizReplyData }: UseQueryResult<any> = useMyQuizReply(myQuizParams, data => {
    console.log(data);
    setQuizTotalPage(data.totalPages);
  });

  useEffect(() => {
    setMyParams({
      page,
    });
  }, [page]);

  useEffect(() => {
    setMyQuizParams({
      quizPage,
    });
  }, [quizPage]);

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
                      <div className="tw-col-span-2">
                        <span className="tw-inline-flex tw-item-right">
                          <div className="tw-flex tw-justify-between tw-mt-2 tw-gap-2">
                            <Button
                              className="tw-w-full tw-bg-white "
                              variant="outlined"
                              sx={{
                                borderColor: 'gray',
                                color: 'gray',
                              }}
                              onClick={() => (location.href = '/profile')}
                            >
                              수정하기
                            </Button>
                            <Button
                              className="tw-w-full tw-bg-white"
                              variant="outlined"
                              onClick={handleLogout}
                              sx={{
                                borderColor: 'gray',
                                color: 'gray',
                              }}
                            >
                              로그아웃
                            </Button>
                          </div>
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
                    {/* {userInfo?.customExperiences?.map((name, i) => (
                      <span
                        key={i}
                        className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-gray-700"
                      >
                        {name}
                      </span>
                    ))} */}
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
                  quizPage,
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
            <Pagination page={page} setPage={setPage} total={totalPage} />
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
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        )}
        <article>
          {/* <div className={cx('filter-area', 'top-filter')}>
            <div className={cx('seminar-button__group')}></div>
          </div> */}

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
              {/* {isContentFetched &&
                (contents.length > 0 ? (
                  contents.map((item, i) => {
                    return (
                      <ArticleCard
                        uiType={ArticleEnum.MENTOR_SEMINAR}
                        content={item}
                        key={i}
                        className={cx('container__item')}
                      />
                    );
                  })
                ) : (
                  <div className={cx('content--empty')}>데이터가 없습니다.</div>
                ))} */}
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}

export default ProfileTemplate;
