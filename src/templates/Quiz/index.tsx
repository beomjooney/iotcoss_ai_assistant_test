import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { ToggleLabel, Pagination, ClubCard } from 'src/stories/components';
import React, { useState } from 'react';
import { RecommendContent } from 'src/models/recommend';
import { useSeminarList, paramProps } from 'src/services/seminars/seminars.queries';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SearchIcon from '@mui/icons-material/Search';
import { useSessionStore } from 'src/store/session';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { ExperiencesResponse } from 'src/models/experiences';
import { useOptions } from 'src/services/experiences/experiences.queries';

const cx = classNames.bind(styles);

export function QuizTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();
  const { logged, roles } = useSessionStore.getState();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [keyWorld, setKeyWorld] = useState('');

  const { isFetched: isOptionFetched, data: optionsData }: UseQueryResult<ExperiencesResponse> = useOptions();

  console.log(optionsData);
  const { isFetched: isContentFetched, refetch } = useSeminarList(params, data => {
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPages);
  });

  const handleTabChange = (event, newValue) => {
    setActive(newValue);
    if (newValue === 0) {
      setParams({ page });
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
      keyword: keyWorld,
    });
  }, [page, keyWorld]);

  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-[60px] max-lg:tw-py-[50px]">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={12} sm={2} className="tw-font-bold tw-text-4xl tw-text-black max-lg:!tw-text-2xl">
              퀴즈클럽
            </Grid>
            <Grid
              item
              xs={12}
              sm={8}
              className="max-lg:tw-py-2 tw-font-light tw-text-base tw-text-black  max-lg:!tw-text-base"
            >
              관심 주제별로 성장 퀴즈를 풀고 네트워킹 할 수 있는 클럽을 만나보세요!
            </Grid>
            <Grid item xs={12} sm={2} justifyContent="flex-end" className="tw-flex">
              {roles.includes('ROLE_MANAGER') && (
                <button
                  onClick={() => (location.href = '/quiz/open')}
                  type="button"
                  className="tw-text-[#FF0000] border border-danger tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
                >
                  + 퀴즈클럽 개설하기
                </button>
              )}
            </Grid>
          </Grid>
        </div>
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
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                  className="" // 커스텀 스타일 적용
                >
                  <Tab
                    label="전체보기"
                    className="tw-text-base"
                    sx={{
                      '&.Mui-selected': {
                        fontWeight: 'bold', // 선택된 탭의 폰트 웨이트를 bold로
                        fontSize: '16px',
                        color: 'black',
                      },
                    }}
                  />
                  {isOptionFetched &&
                    optionsData?.data?.jobs?.map((item, i) => (
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
                        key={item.id}
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

        {/* <Divider className="tw-mb-6 tw-border tw-bg-['#efefef']" /> */}
        <hr className="tw-y-14 tw-my-5 tw-h-[0.5px] tw-border-t tw-bg-gray-300 " />
        <article>
          <div className={cx('content-area')}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              rowSpacing={4}
              columnSpacing={{ xs: 4, sm: 4, md: 4 }}
            >
              {isContentFetched &&
                (contents.length > 0 ? (
                  contents.map((item, index) => {
                    return (
                      <ClubCard
                        key={index}
                        item={item}
                        xs={6}
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
            <div className="tw-mt-10">
              <Pagination page={page} setPage={setPage} total={totalPage} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default QuizTemplate;
