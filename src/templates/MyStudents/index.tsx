import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { ToggleLabel, Pagination, Typography, Chip, ClubCard } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { paramProps, useMyClubList, useMyStudentsList } from 'src/services/seminars/seminars.queries';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import Divider from '@mui/material/Divider';
import LectureClubMiniCard from 'src/stories/components/LectureClubMiniCard';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import CircularProgress from '@mui/material/CircularProgress';
import { useSessionStore } from 'src/store/session';
import { useRouter } from 'next/router';

const cx = classNames.bind(styles);

export function MyStudentsTemplate() {
  const { logged, roles } = useSessionStore.getState();
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [keyWorld, setKeyWorld] = useState('');
  const [params, setParams] = useState<any>({ size: 10, page, clubViewFilter: '0002', clubType: '0200' });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    isFetched: isContentFetched,
    isLoading,
    refetch,
  } = useMyStudentsList(params, data => {
    console.log('data', data);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, keyWorld]);

  return (
    <>
      <div className={cx('seminar-container')}>
        <div className={cx('container')}>
          <div className="tw-py-[60px]">
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={12} sm={2} className="tw-font-bold tw-text-3xl tw-text-black">
                My학습자
              </Grid>
              <Grid item xs={12} sm={10} className="tw-font-semi tw-text-base tw-text-black">
                지도교수자로 등록된 학생들 목록입니다
              </Grid>
            </Grid>
          </div>
          <Box sx={{ width: '100%', typography: 'body1', marginTop: '20px', marginBottom: '30px' }}>
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={12} className="tw-font-bold tw-text-3xl tw-text-black">
                <div className={cx('')}>
                  <div className="tw-w-full tw-flex tw-justify-end">
                    <div className="tw-flex tw-items-center tw-justify-end tw-text-right">
                      <TextField
                        id="outlined-basic"
                        label=""
                        variant="outlined"
                        placeholder="강의클럽명 또는 교수이름을 입력하세요."
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
            </Grid>
          </Box>

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
                        <LectureClubMiniCard
                          refetch={refetch}
                          key={index}
                          item={item}
                          xs={12}
                          className={cx('reply-container__item')}
                        />
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

export default MyStudentsTemplate;
