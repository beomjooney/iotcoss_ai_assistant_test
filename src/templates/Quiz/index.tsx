import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, ClubCard } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent } from 'src/models/recommend';
import { useSeminarList, paramProps } from 'src/services/seminars/seminars.queries';
import { useContentJobTypes, useContentTypes, useJobGroups } from 'src/services/code/code.queries';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useSessionStore } from 'src/store/session';

const levelGroup = [
  {
    id: '0100',
    groupId: '0001',
    name: '0',
    description: '레벨 0',
  },
  {
    id: '0200',
    groupId: '0001',
    name: '1',
    description: '레벨 1',
  },
  {
    id: '0300',
    groupId: '0001',
    name: '2',
    description: '레벨 2',
  },
  {
    id: '0301',
    groupId: '0001',
    name: '3',
    description: '레벨 3',
  },
  {
    id: '0302',
    groupId: '0001',
    name: '4',
    description: '레벨 4',
  },
  ,
  {
    id: '0303',
    groupId: '0001',
    name: '5',
    description: '레벨 5',
  },
];

const cx = classNames.bind(styles);

export function QuizTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();
  const { logged } = useSessionStore.getState();
  const router = useRouter();
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [skillIdsClk, setSkillIdsClk] = useState<any[]>([1, 2, 3, 4, 5]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);
  const [seminarFilter, setSeminarFilter] = useState(['0002']);
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [images, setSeminarImages] = useState<any[]>([]);
  const [recommendJobGroup, setRecommendJobGroup] = useState<any[]>([]);
  const [contentJobType, setContentJobType] = useState<any[]>([]);
  const [jobGroup, setJobGroup] = useState([]);
  const [active, setActive] = useState(0);
  const [contentType, setContentType] = useState(0);
  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [keyWorld, setKeyWorld] = useState('');

  const { isFetched: isContentFetched, refetch } = useSeminarList(params, data => {
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPages);
  });

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }

  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setContentTypes(data.data.contents || []);
    const contentsType = data.length >= 0 && data[0].id;
    setParams({
      ...params,
      // contentsType,
    });
  });

  const { isFetched: isContentTypeJobFetched } = useContentJobTypes(data => {
    setContentJobType(data.data.contents || []);
  });

  useEffect(() => {
    setParams({
      // ...params,
      page,
      keyword: keyWorld,
    });
  }, [page, keyWorld]);

  const handleJobs = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    //console.log('job', event.currentTarget, newFormats);
    setJobGroup(newFormats);

    setParams({
      ...params,
      recommendJobGroups: contentType,
      recommendJobs: newFormats.join(','),
      page,
    });
    setPage(1);
    //console.log(newFormats);
  };

  const handleRecommendLevels = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setRecommendLevels(newFormats);

    setParams({
      ...params,
      recommendJobGroups: contentType,
      recommendLevels: newFormats.join(','),
      page,
    });
    setPage(1);
  };

  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-[60px]">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black max-lg:!tw-text-base">
              퀴즈클럽
            </Grid>
            <Grid item xs={8} className="max-lg:tw-p-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-sm">
              관심 주제별로 성장 퀴즈를 풀고 네트워킹 할 수 있는 클럽을 만나보세요!
            </Grid>
            <Grid item xs={2} justifyContent="flex-end" className="tw-flex">
              <button
                onClick={() => (location.href = '/quiz/open')}
                type="button"
                className="tw-text-white tw-bg-blue-500 tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5"
              >
                퀴즈클럽 개설하기
              </button>
            </Grid>
          </Grid>
        </div>
        <Box sx={{ width: '100%', typography: 'body1', marginBottom: '20px' }}>
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={9} className="tw-font-bold tw-text-3xl tw-text-black">
              <div className={cx('filter-area')}>
                <div className={cx('mentoring-button__group', 'gap-12', 'justify-content-center')}>
                  <Toggle
                    label="전체보기"
                    name="전체보기"
                    value=""
                    variant="small"
                    checked={active === 0}
                    isActive
                    type="tabButton"
                    onChange={() => {
                      setActive(0);
                      setParams({
                        page,
                      });
                      setPage(1);
                    }}
                    className={cx('fixed-width')}
                  />
                  {isContentTypeFetched &&
                    contentTypes.map((item, i) => (
                      <Toggle
                        key={item.id}
                        label={item.name}
                        name={item.name}
                        value={item.id}
                        variant="small"
                        checked={active === i + 1}
                        isActive
                        type="tabButton"
                        onChange={() => {
                          setActive(i + 1);
                          setContentType(item.id);
                          setParams({
                            ...params,
                            recommendJobGroups: item.id,
                            page,
                          });
                          setPage(1);
                        }}
                        className={cx('fixed-width', 'tw-ml-4', 'max-lg:!tw-hidden')}
                      />
                    ))}
                </div>
              </div>
            </Grid>
            <Grid item xs={3} className="tw-font-semi tw-text-base tw-text-black">
              <TextField
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
              />
            </Grid>
          </Grid>
        </Box>

        {/* <Divider className="tw-mb-6 tw-border tw-bg-['#efefef']" /> */}
        <hr className="tw-y-14 tw-my-5 tw-h-[1px] tw-border-t tw-bg-gray-300 " />
        {active != 0 && (
          <div>
            <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 직군</div>
              <ToggleButtonGroup
                style={{ display: 'inline' }}
                value={jobGroup}
                onChange={handleJobs}
                aria-label="text alignment"
                size="small"
              >
                {isContentTypeJobFetched &&
                  contentJobType.map((item, i) => (
                    <ToggleButton
                      key={item.id}
                      value={item.id}
                      className="tw-ring-1 tw-ring-slate-900/10"
                      style={{
                        borderRadius: '5px',
                        borderLeft: '0px',
                        margin: '5px',
                        height: '30px',
                        border: '0px',
                      }}
                    >
                      {item.name}
                    </ToggleButton>
                  ))}
              </ToggleButtonGroup>
            </div>

            <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
              <span className="tw-font-bold tw-text-base tw-text-black tw-mr-4">레벨</span>
              <ToggleButtonGroup
                value={recommendLevels}
                onChange={handleRecommendLevels}
                aria-label="text alignment"
                size="small"
              >
                {levelGroup?.map((item, index) => (
                  <ToggleButton
                    key={`job-${index}`}
                    value={item.name}
                    aria-label="fff"
                    className="tw-ring-1 tw-ring-slate-900/10"
                    style={{
                      borderRadius: '5px',
                      borderLeft: '0px',
                      margin: '5px',
                      height: '30px',
                      border: '0px',
                    }}
                  >
                    레벨 {item.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
          </div>
        )}
        <article>
          <div className={cx('content-area')}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              rowSpacing={4}
              columnSpacing={{ xs: 1, sm: 2, md: 4 }}
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
