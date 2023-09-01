import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Button from 'src/stories/components/Button';
import React, { useState } from 'react';
import { Chip, Pagination, Typography } from 'src/stories/components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../../store/session';
import { useSeminarList, useSeminarMeList } from 'src/services/seminars/seminars.queries';
import Grid from '@mui/material/Grid';
import { jobColorKey } from 'src/config/colors';

const cx = classNames.bind(styles);

interface GrowthStoryTemplateProps {
  hasInfoData?: any;
  userType?: any;
}

export function GrowthStoryTemplate({ hasInfoData, userType }: GrowthStoryTemplateProps) {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page });

  const [contents, setContents] = useState<RecommendContent[]>([]);

  const { isFetched: isContentFetched } = useSeminarMeList(params, data => {
    console.log('quiz club : ', data.data.contents);
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPage);
  });

  const router = useRouter();

  const onGrowthStory = async () => {
    if (hasInfoData) {
      await router.push(
        { pathname: `/growth-story/${memberId}`, query: { type: userType === '0001' ? 'MENTEE' : 'MENTOR' } },
        `/growth-story/${memberId}`,
      );
    } else {
      // 여기서 신청은 무조건 멘티
      await router.push({ pathname: '/growth-story', query: { type: 'MENTEE' } }, '/growth-story');
    }
  };

  return (
    <div className={cx('growth-story-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          <Grid container direction="row" justifyContent="left" alignItems="center" rowSpacing={3}>
            {isContentFetched &&
              (contents.length > 0 ? (
                contents.map((item, index) => {
                  return (
                    <Grid key={index} item xs={12}>
                      <a
                        href={'/quiz/' + `${item.sequence}`}
                        className="tw-flex tw-flex-col tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow md:tw-flex-row  hover:tw-bg-gray-100 dark:tw-border-gray-700 dark:tw-bg-gray-800 dark:hover:tw-bg-gray-700"
                      >
                        <img
                          className="tw-object-cover tw-w-[220px] tw-rounded-t-lg tw-h-[245px] md:tw-h-[245px] md:tw-w-[220px] md:tw-rounded-none md:tw-rounded-l-lg"
                          src="/assets/images/banner/Rectangle1.png"
                          alt=""
                        />
                        <div className="tw-flex tw-flex-col tw-justify-between tw-p-4 tw-leading-normal">
                          <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                            {item?.recommendJobGroupNames.map((name, i) => (
                              <Chip
                                key={`job_${i}`}
                                chipColor={jobColorKey(item?.recommendJobGroups[i])}
                                radius={4}
                                className="tw-mr-2"
                                variant="outlined"
                              >
                                {name}
                              </Chip>
                            ))}
                            {item?.recommendJobNames.map((name, i) => (
                              <Chip
                                key={`job_${i}`}
                                chipColor={jobColorKey(item?.recommendJobGroups[i])}
                                radius={4}
                                className="tw-mr-2"
                                variant="outlined"
                              >
                                {name}
                              </Chip>
                            ))}
                            {item?.relatedExperiences.map((name, i) => (
                              <Chip
                                key={`job_${i}`}
                                chipColor={jobColorKey(item?.relatedExperiences[i])}
                                radius={4}
                                className="tw-mr-2"
                                variant="outlined"
                              >
                                {name}
                              </Chip>
                            ))}
                            <Chip chipColor="primary" radius={4} variant="filled">
                              {item?.recommendLevels.sort().join(',')}레벨
                            </Chip>
                          </div>
                          <div className="tw-mb-3 tw-text-sm tw-font-semibold tw-text-gray-500 dark:tw-text-gray-400">
                            모집마감일 : {item.endAt}
                          </div>
                          <h6 className="tw-mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
                            {item.name}
                          </h6>
                          <p className="tw-line-clamp-2 tw-mb-3 tw-font-normal tw-text-gray-700 dark:tw-text-gray-400">
                            {item.description}
                          </p>

                          <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-400 dark:tw-text-gray-400">
                            {item.studyCycle.toString()} | {item.studyWeekCount} 주 | 학습 {item.recruitMemberCount}회
                          </div>

                          <div className="tw-flex tw-items-center tw-space-x-4">
                            <img
                              className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full"
                              src={item?.author?.avatar}
                              alt=""
                            />
                            <div className="tw-text-sm tw-font-semibold tw-text-black dark:tw-text-white">
                              <div>{item?.author?.displayName}</div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </Grid>
                    // <ArticleCard
                    //   uiType={ArticleEnum.MENTOR_SEMINAR}
                    //   content={item}
                    //   key={i}
                    //   className={cx('container__item')}
                    // />
                  );
                })
              ) : (
                <div className={cx('content--empty')}>데이터가 없습니다.</div>
              ))}
          </Grid>
          <Pagination page={page} setPage={setPage} total={totalPage} />
          {/* {!hasInfoData && (
            <>
              <Image src={`/assets/images/icons/emoticon-cry-outline.svg`} alt="sorry" width="52" height="52" />
              <Typography type="B1" tag="p" extendClass="pl-3">
                등록된 성장 스토리가 없습니다.
              </Typography>
            </>
          )}
          {!!hasInfoData && (
            <Button color="primary" label={'성장 스토리 수정하기 >'} size="small" onClick={onGrowthStory} />
          )}
          {!hasInfoData && (
            <Button color="primary" label={'성장 스토리 입력하기 >'} size="small" onClick={onGrowthStory} />
          )} */}
        </div>
      </section>
    </div>
  );
}
