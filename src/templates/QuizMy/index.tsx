import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Typography, Chip, ClubCard } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { paramProps, useMyClubList } from 'src/services/seminars/seminars.queries';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import Divider from '@mui/material/Divider';
import { useDeleteLike, useSaveLike } from 'src/services/community/community.mutations';
import { useSessionStore } from 'src/store/session';
import ClubMiniCard from 'src/stories/components/ClubMiniCard';

const cx = classNames.bind(styles);

export function QuizMyTemplate() {
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page, clubStatus: '0004' });

  const { isFetched: isContentFetched, refetch } = useMyClubList(params, data => {
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPages);
  });

  useEffect(() => {
    setParams({
      ...params,
      page,
    });
  }, [page]);

  return (
    <div className={cx('seminar-container')}>
      <div className={cx('container')}>
        <div className="tw-py-[60px]">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={4} className="tw-font-bold tw-text-3xl tw-text-black">
              퀴즈클럽 {'-'} 내가 만든 클럽
            </Grid>
            <Grid item xs={5} className="tw-font-semi tw-text-base tw-text-black">
              내가 만든 클럽 페이지에 관한 간단한 설명란
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                onClick={() => (location.href = '/quiz/open')}
                type="button"
                className="tw-text-white tw-bg-blue-500  tw-focus:ring-4  tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
              >
                성장퀴즈 클럽 개설하기 +
              </button>
            </Grid>
          </Grid>
        </div>
        <Box sx={{ width: '100%', typography: 'body1', marginTop: '20px', marginBottom: '30px' }}>
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={8} className="tw-font-bold tw-text-3xl tw-text-black">
              {/* <SecondTabs tabs={testBoards} /> */}

              <div className={cx('filter-area')}>
                <div className={cx('mentoring-button__group', 'gap-12', 'justify-content-center')}>
                  <Toggle
                    label="진행중"
                    name="진행중"
                    value=""
                    variant="small"
                    checked={active === 0}
                    isActive
                    type="tabButton"
                    onChange={() => {
                      setActive(0);
                      setParams({
                        page,
                        clubStatus: '0004',
                      });
                      setPage(1);
                    }}
                    className={cx('fixed-width')}
                  />
                  <Toggle
                    label="진행예정"
                    name="진행예정"
                    value=""
                    variant="small"
                    checked={active === 1}
                    isActive
                    type="tabButton"
                    onChange={() => {
                      setActive(1);
                      setParams({
                        ...params,
                        clubStatus: '0003',
                        page,
                      });
                      setPage(1);
                    }}
                    className={cx('fixed-width', 'tw-ml-4')}
                  />
                  <Toggle
                    label="종료"
                    name="종료"
                    value=""
                    variant="small"
                    checked={active === 2}
                    isActive
                    type="tabButton"
                    onChange={() => {
                      setActive(2);
                      setParams({
                        ...params,
                        clubStatus: '0005',
                        page,
                      });
                      setPage(1);
                    }}
                    className={cx('fixed-width', 'tw-ml-4')}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={4} className="tw-font-semi tw-text-base tw-text-black">
              {/* <TextField
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
              /> */}
            </Grid>
          </Grid>
        </Box>

        <Divider className="tw-mb-3 tw-border tw-bg-['#efefef']" />
        <article>
          <div className={cx('content-area')}>
            <section className={cx('content', 'flex-wrap-container')}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {isContentFetched &&
                  (contents.length > 0 ? (
                    contents.map((item, index) => {
                      return (
                        <ClubMiniCard
                          key={index}
                          item={item}
                          xs={12}
                          // writer={memberSample}
                          className={cx('reply-container__item')}
                          // memberId={memberId}
                          // onPostDeleteSubmit={onPostDeleteSubmit}
                        />
                      );
                    })
                  ) : (
                    <div className={cx('content--empty')}>데이터가 없습니다.</div>
                  ))}
              </Grid>
            </section>
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </article>
      </div>
    </div>
  );
}

export default QuizMyTemplate;
