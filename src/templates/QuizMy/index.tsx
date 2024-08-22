import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { ToggleLabel, Pagination, Typography, Chip, ClubCard } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { paramProps, useMyClubList } from 'src/services/seminars/seminars.queries';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import Divider from '@mui/material/Divider';
import ClubMiniCard from 'src/stories/components/ClubMiniCard';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import CircularProgress from '@mui/material/CircularProgress';

const cx = classNames.bind(styles);

export function QuizMyTemplate() {
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [keyWorld, setKeyWorld] = useState('');
  const [params, setParams] = useState<any>({ page, clubViewFilter: '0001', clubType: '0100' });

  const {
    isFetched: isContentFetched,
    isLoading,
    refetch,
  } = useMyClubList(params, data => {
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPages);
  });

  function searchKeyworld(value) {
    console.log('value', value);
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  useDidMountEffect(() => {
    setParams({
      ...params,
      page,
      keyword: keyWorld,
    });
  }, [page, keyWorld]);

  return (
    <>
      <div className={cx('seminar-container')}>
        <div className={cx('container')}>
          <div className="tw-py-[60px]">
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black">
                나의클럽
              </Grid>
              <Grid item xs={10} className="tw-font-semi tw-text-base tw-text-black">
                내가 운영중인 퀴즈클럽을 한 눈에 보여주고 있어요!
              </Grid>
            </Grid>
          </div>
          <Box sx={{ width: '100%', typography: 'body1', marginTop: '20px', marginBottom: '30px' }}>
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={12} className="tw-font-bold tw-text-3xl tw-text-black">
                <div className={cx('')}>
                  <div className="tw-w-full tw-flex tw-justify-between">
                    <div className="tw-flex">
                      <ToggleLabel
                        label="진행전 클럽"
                        name="진행전 클럽"
                        value=""
                        variant="small"
                        checked={active === 0}
                        isActive
                        type="tabButton"
                        onChange={() => {
                          setActive(0);
                          setParams({
                            page,
                            clubViewFilter: '0001',
                            clubType: '0100',
                          });
                          setPage(1);
                        }}
                        className={cx('fixed-width tw-w-[150px]')}
                      />
                      <ToggleLabel
                        label="진행중인 클럽"
                        name="진행중인 클럽"
                        value=""
                        variant="small"
                        checked={active === 1}
                        isActive
                        type="tabButton"
                        onChange={() => {
                          setActive(1);
                          setParams({
                            page,
                            clubViewFilter: '0002',
                            clubType: '0100',
                          });
                          setPage(1);
                        }}
                        className={cx('fixed-width tw-w-[150px]')}
                      />
                      <ToggleLabel
                        label="종료된 클럽"
                        name="종료된 클럽"
                        value=""
                        variant="small"
                        checked={active === 2}
                        isActive
                        type="tabButton"
                        onChange={() => {
                          setActive(2);
                          setParams({
                            ...params,
                            clubViewFilter: '0003',
                            clubType: '0100',
                            page,
                          });
                          setPage(1);
                        }}
                        className={cx('fixed-width tw-w-[150px]')}
                      />
                    </div>
                    <div className="tw-flex tw-items-center tw-justify-end tw-text-right">
                      <TextField
                        id="outlined-basic"
                        label=""
                        variant="outlined"
                        InputProps={{
                          style: { height: '43px' },
                          startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                        }}
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            searchKeyworld((e.target as HTMLInputElement).value);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4} className="tw-font-semi tw-text-base tw-text-black"></Grid>
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
                  {isLoading ? (
                    <div className="tw-flex tw-justify-center tw-items-center tw-py-40">
                      <CircularProgress />
                    </div>
                  ) : (
                    isContentFetched &&
                    (contents.length > 0 ? (
                      contents.map((item, index) => (
                        <ClubMiniCard key={index} item={item} xs={12} className={cx('reply-container__item')} />
                      ))
                    ) : (
                      <div className={cx('content--empty tw-py-40')}>데이터가 없습니다.</div>
                    ))
                  )}
                </Grid>
              </section>
              <Pagination page={page} setPage={setPage} total={totalPage} />
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

export default QuizMyTemplate;
