import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import { useMemberActiveSummaryInfo } from 'src/services/account/account.queries';
import router from 'next/router';
import { Mobile, Desktop } from 'src/hooks/mediaQuery';
import { useQuizActivityHistory } from 'src/services/quiz/quiz.queries';
import { Pagination } from 'src/stories/components';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

export function MyActivityTemplate() {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any>([]);

  const [summary, setSummary] = useState({});
  const { isFetched: isUserFetched } = useMemberActiveSummaryInfo(data => setSummary(data));

  const { isFetched: isContentFetched, refetch: refetch } = useQuizActivityHistory(params, data => {
    console.log(data);
    setContents(data);
    setTotalPage(data?.totalPage);
    setPage(data?.page);
  });

  useEffect(() => {
    setParams({
      page,
    });
  }, [page]);

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          {isUserFetched && (
            <>
              <Desktop>
                <div>
                  <div className="tw-grid tw-grid-cols-5 tw-gap-0 tw-p-5 tw-flex tw-items-center tw-justify-between tw-gap-5">
                    <div className="tw-h-[350px] tw-rounded-md  border border-secondary tw-border-indigo-500 tw-col-span-3 tw-text-base tw-font-bold tw-text-gray-600 tw-text-center tw-p-5">
                      <div className="tw-text-xl tw-pt-4 tw-text-red-500">Today</div>
                      <div className="tw-text-xl tw-pb-10 tw-text-black">
                        {summary?.todaySummary?.date} ({summary?.todaySummary?.dayOfWeek})
                      </div>

                      {summary?.todaySummary?.activities?.map((item, index) => {
                        return (
                          <div key={index}>
                            {item?.name} &nbsp;&nbsp;&nbsp;&nbsp; {item?.date}
                          </div>
                        );
                      })}
                      <div className="tw-py-10">
                        <button
                          onClick={() => router.push('/studyroom')}
                          className="tw-bg-red-500 tw-rounded-md tw-text-sm tw-text-white tw-font-bold tw-py-2.5 tw-px-14 tw-rounded"
                        >
                          나의 학습방
                        </button>
                      </div>
                    </div>
                    <div className="tw-h-[350px] border border-secondary tw-col-span-2 tw-text-base tw-font-bold tw-text-gray-600 tw-text-center  tw-rounded-md  tw-p-5">
                      <div className="tw-text-xl tw-py-4 tw-text-black">최근 획득한 배지</div>
                      <div className="tw-text-center">
                        <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
                          <img
                            className="tw-object-cover tw-h-[80px] "
                            src={`${process.env.NEXT_PUBLIC_GENERAL_URL}/assets/images/badge/${summary?.lastAchievedBadge?.badgeId}.png`}
                            alt=""
                          />
                        </div>
                        <div className="tw-text-sm tw-text-black tw-font-bold">{summary?.lastAchievedBadge?.name}</div>
                        <div className="tw-text-sm tw-text-black tw-py-4">
                          {summary?.lastAchievedBadge?.description}
                        </div>
                        <div className="tw-text-sm tw-text-black">
                          {summary?.lastAchievedBadge?.achievementAt?.split(' ')[0]}
                        </div>
                      </div>
                      <div className="tw-py-5">
                        {/* <button
                          onClick={() => router.push('/profile')}
                          className="tw-bg-[#c1a876] tw-rounded-md tw-text-sm tw-text-white tw-font-bold tw-py-2.5 tw-px-14 tw-rounded"
                        >
                          배지 전체보기
                        </button> */}
                      </div>
                    </div>
                  </div>
                  <div className="tw-font-bold tw-text-xl tw-text-black tw-py-5">나의 활동로그</div>
                  {isContentFetched ? (
                    contents?.contents?.length > 0 ? (
                      contents.contents.map((item, index) => (
                        <div key={index} role="tw-list" className="tw-divide-y tw-divide-gray-100 border-bottom">
                          <div className="tw-justify-between">
                            <div className="tw-min-w-0 tw-p-3 tw-font-semibold">
                              {item?.date} {item?.dayOfWeek}
                            </div>
                            {item?.activities.map((activity, idx) => (
                              <div key={idx} className="border-top tw-p-3 tw-text-black tw-text-sm">
                                {activity?.activityMessage}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="tw-p-3 tw-text-center tw-text-gray-500">활동내역이 없습니다.</div>
                    )
                  ) : (
                    <div className="tw-p-3 tw-text-center tw-text-gray-500">Loading...</div>
                  )}

                  <div className="tw-mt-10">
                    <Pagination page={page} setPage={setPage} total={totalPage} />
                  </div>
                </div>
              </Desktop>
              <Mobile>
                <div className="tw-font-bold tw-text-xl tw-text-black tw-py-10">나의 활동내역</div>
                <div className="tw-gap-0 tw-p-5 tw-gap-5">
                  <div className="tw-h-[300px] border-3 border-primary tw-border-indigo-500 tw-text-base tw-font-bold tw-text-gray-600 tw-text-center tw-p-5">
                    <div className="tw-text-xl tw-py-4 tw-text-blue-500">Today</div>
                    <div className="tw-text-xl tw-py-2 tw-text-gray-400">
                      {summary?.todaySummary?.date} ({summary?.todaySummary?.dayOfWeek})
                    </div>
                    <div>학습예정</div>
                    <div className="tw-py-5">
                      <button
                        onClick={() => router.push('/studyroom')}
                        className="tw-bg-red-500 tw-rounded-md tw-text-sm tw-text-white tw-font-bold tw-py-2.5 tw-px-14 tw-rounded"
                      >
                        나의 학습방
                      </button>
                    </div>
                  </div>
                  <div className="tw-h-[300px] border tw-mt-5 tw-text-base tw-font-bold tw-text-gray-600 tw-text-center  tw-rounded-md  tw-p-5">
                    <div className="tw-text-xl tw-py-4 tw-text-black">최근 획득한 배지</div>
                    <div className="tw-text-center">
                      <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
                        <img
                          className="tw-object-cover tw-h-[80px] "
                          src={`${process.env.NEXT_PUBLIC_GENERAL_URL}/assets/images/badge/${summary?.lastAchievedBadge?.badgeId}.png`}
                          alt=""
                        />
                      </div>
                      <div className="tw-text-sm tw-text-black tw-font-bold">{summary?.lastAchievedBadge?.name}</div>
                      <div className="tw-text-sm tw-text-black tw-line-clamp-1">
                        {summary?.lastAchievedBadge?.description}
                      </div>
                      <div className="tw-text-sm tw-text-black">
                        {summary?.lastAchievedBadge?.achievementAt?.split(' ')[0]}
                      </div>
                    </div>
                    <div className="tw-py-5">
                      <button
                        onClick={() => router.push('/profile')}
                        className="tw-bg-[#c1a876] tw-rounded-md tw-text-sm tw-text-white tw-font-bold tw-py-2.5 tw-px-14 tw-rounded"
                      >
                        배지 전체보기
                      </button>
                    </div>
                  </div>
                </div>
                <div className="tw-font-bold tw-text-xl tw-text-black tw-py-10">나의 활동로그</div>
                <div className="border tw-rounded-md">
                  {isContentFetched ? (
                    contents?.contents?.length > 0 ? (
                      contents.contents.map((item, index) => (
                        <div key={index} role="tw-list" className="tw-divide-y tw-divide-gray-100 border-bottom">
                          <div className="tw-justify-between">
                            <div className="tw-min-w-0 tw-p-3 tw-font-semibold">
                              {item?.date} {item?.dayOfWeek}
                            </div>
                            {item?.activities.map((activity, idx) => (
                              <div key={idx} className="tw-cursor-pointer border-top tw-p-3 tw-text-black tw-text-sm">
                                {!activity?.isChecked && (
                                  <div className="tw-bottom-auto tw-left-auto tw-right-0 tw-top-0 tw-z-10 tw-inline-block tw-rounded-full tw-bg-red-600 tw-p-[3px] tw-text-sm tw-mx-2 tw-mr-3"></div>
                                )}
                                {activity?.activityMessage}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="tw-p-3 tw-text-center tw-text-gray-500">활동내역이 없습니다.</div>
                    )
                  ) : (
                    <div className="tw-p-3 tw-text-center tw-text-gray-500">Loading...</div>
                  )}
                </div>
              </Mobile>
            </>
          )}
          <div className="tw-mt-10">{/* <Pagination page={page} setPage={setPage} total={totalPage} /> */}</div>
        </div>
      </section>
    </div>
  );
}
