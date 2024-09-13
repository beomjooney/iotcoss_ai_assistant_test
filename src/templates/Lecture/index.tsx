'use client';

import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Pagination, LectureCard } from 'src/stories/components';
import React, { useState, useEffect } from 'react';
import { RecommendContent } from 'src/models/recommend';
import { useSeminarList, paramProps } from 'src/services/seminars/seminars.queries';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SearchIcon from '@mui/icons-material/Search';
import { useSessionStore } from 'src/store/session';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useOptions } from 'src/services/experiences/experiences.queries';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { UseQueryResult } from 'react-query';
// 챗봇
import ChatbotModal from 'src/stories/components/ChatBot';
import { getButtonClass } from 'src/utils/clubStatus';

const cx = classNames.bind(styles);

export function LectureTemplate() {
  const { roles, menu, token, logged, tenantName } = useSessionStore.getState();
  const router = useRouter();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page, clubType: '0200' });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  const [keyWorld, setKeyWorld] = useState('');
  const [universities, setUniversities] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { isFetched: isOptionFetched, data: optionsData }: UseQueryResult<any> = useOptions(data => {
    setUniversities([{ code: '0100', name: '전체보기' }, ...data.data.jobs]);
  });

  const {
    isFetched: isContentFetched,
    isLoading,
    refetch,
  } = useSeminarList(params, data => {
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPages);
  });

  const handleTabChange = (event, newValue) => {
    setActive(newValue);
    if (newValue === 0) {
      setParams({ page, clubType: '0200' });
    } else {
      const selectedItem = optionsData.data.jobs[newValue - 1];
      setContentType(selectedItem.id);
      setParams({ ...params, recommendJobGroups: selectedItem.code, page });
    }
    setPage(1);
  };

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  useDidMountEffect(() => {
    setParams({
      // ...params,
      page,
      clubType: '0200',
      keyword: keyWorld,
    });
  }, [page, keyWorld]);

  console.log('logged', logged);

  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-[40px] max-lg:tw-py-[40px]">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={12} sm={2} className="tw-font-bold tw-text-3xl tw-text-black max-lg:!tw-text-2xl">
              강의클럽
            </Grid>
            <Grid
              item
              xs={12}
              sm={8}
              className="max-lg:tw-py-2 tw-font-light tw-text-base tw-text-black  max-lg:!tw-text-base"
            >
              강의를 들으며 AI조교를 통해 질의응답을 하며 수업에 참여해보세요!
            </Grid>
            <Grid item xs={12} sm={2} justifyContent="flex-end" className="tw-flex">
              {isClient && roles.includes('ROLE_MANAGER') && (
                <button
                  onClick={() => router.push('/lecture/open')}
                  type="button"
                  className="tw-text-blue-600 border border-primary tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                >
                  + 강의클럽 개설하기
                </button>
              )}
            </Grid>
          </Grid>
        </div>
        {logged && isClient && (
          <Box sx={{ width: '100%', typography: 'body1', marginBottom: '20px' }}>
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={12} sm={9} className="tw-font-bold tw-text-3xl tw-text-black tw-pr-2">
                <Box className="filter-area">
                  <Tabs
                    sx={{
                      '& .MuiTabs-indicator': { display: 'none' },
                      '&.Mui-selected': {
                        fontWeight: 'bold', // 선택된 탭의 폰트 웨이트를 bold로
                        color: 'black',
                      },
                    }}
                    value={active}
                    onChange={handleTabChange}
                    variant="scrollable"
                  >
                    {isOptionFetched &&
                      universities?.map((item, i) => (
                        <Tab
                          sx={{
                            '&.Mui-selected': {
                              fontWeight: 'bold', // 선택된 탭의 폰트 웨이트를 bold로
                              fontSize: '16px',
                              color: 'black',
                            },
                            fontSize: '16px',
                          }}
                          className="tw-text-base"
                          key={i}
                          label={item.name}
                        />
                      ))}
                  </Tabs>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3} className="tw-font-semi tw-text-base tw-text-black">
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label=""
                  placeholder="수업명, 교수님명으로 클럽검색하기"
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
                />
              </Grid>
            </Grid>
          </Box>
        )}
        {logged && isClient && <hr className="tw-y-14 tw-mt-7 tw-mb-10 tw-h-[0.5px] tw-border-t tw-bg-gray-300 " />}
        <article>
          <div
            className={cx('content-area', isClient && logged ? '' : 'tw-max-h-[16rem] tw-overflow-hidden tw-relative')}
          >
            {isClient && !logged && (
              <div className="tw-z-1 tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-h-[300px] tw-bg-gradient-to-t tw-from-white tw-to-transparent tw-pointer-events-none"></div>
            )}

            <Grid
              container
              direction="row"
              justifyContent="space-between"
              rowSpacing={4}
              columnSpacing={{ xs: 4, sm: 4, md: 4 }}
              alignItems="center"
            >
              {isLoading ? (
                <Grid
                  item
                  xs={12}
                  className="tw-flex tw-justify-center tw-items-center tw-py-96"
                  container
                  justifyContent="center"
                  alignItems="center"
                >
                  <div className="tw-flex tw-justify-center tw-items-center tw-py-96">
                    <CircularProgress />
                  </div>
                </Grid>
              ) : (
                isContentFetched &&
                (contents.length > 0 ? (
                  contents.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        <LectureCard
                          item={item}
                          xs={6}
                          className={cx('reply-container__item')}
                          selectedImage=""
                          selectedImageBanner=""
                          // selectedImageBanner="/assets/images/banner/Rectangle_201.png"
                        />
                      </React.Fragment>
                    );
                  })
                ) : (
                  <div className={cx('content--empty')}>데이터가 없습니다.</div>
                ))
              )}
            </Grid>
            <div className="tw-mt-10">
              <Pagination page={page} setPage={setPage} total={totalPage} />
            </div>
          </div>
          {isClient && !logged && (
            <div className="tw-flex tw-flex-col tw-gap-5 tw-max-w-sm tw-px-4 tw-mx-auto tw-py-14">
              <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-text-center">
                <p className="tw-text-2xl tw-text-color-text-bold tw-font-bold tw-text-black">
                  강의 클럽이 궁금하다면?
                </p>
              </div>
              <div>
                <div className="tw-flex tw-flex-row tw-justify-center tw-items-center tw-gap-2">
                  <p className="tw-text-sm tw-text-color-slate-900 tw-py-3">이미 회원이신가요?</p>
                </div>
                <button
                  className={`${getButtonClass(
                    tenantName,
                  )}  tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-text-white`}
                  onClick={() => router.push('/account/login')}
                >
                  로그인
                </button>
              </div>
              <Divider className={cx('sign-color', 'tw-py-1')}>또는</Divider>
              <div>
                <button
                  className="tw-font-bold tw-rounded-md tw-w-full tw-h-[48px] tw-bg-white tw-text-black border"
                  onClick={() => router.push('/account/signup')}
                >
                  <Typography sx={{ fontWeight: '600', fontSize: 16 }}>이메일로 가입하기</Typography>
                </button>
              </div>
            </div>
          )}
        </article>
      </div>
      {isClient && !modalIsOpen && logged && menu.use_lecture_club && (
        <div
          className="tw-fixed tw-bottom-0 tw-right-0  tw-mr-4 md:tw-mr-10 tw-mb-4 md:tw-mb-8 tw-cursor-pointer tw-z-10"
          onClick={() => setModalIsOpen(true)}
        >
          <img className="tw-w-24 tw-h-24" src="/assets/images/main/chatbot.png" />
        </div>
      )}
      {isClient && <ChatbotModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} token={token} />}
    </div>
  );
}

export default LectureTemplate;
