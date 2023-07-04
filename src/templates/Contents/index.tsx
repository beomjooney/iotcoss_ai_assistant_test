import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Banner from 'src/stories/components/Banner';
import { Toggle, Textfield, Pagination, Typography } from 'src/stories/components';
import React, { useEffect, useRef, useState } from 'react';
import { RecommendContent } from 'src/models/recommend';
import { useContentTypes, useJobGroups } from 'src/services/code/code.queries';
import ArticleCard from 'src/stories/components/ArticleCard';
import { paramProps, useRecommendContents } from 'src/services/contents/contents.queries';
import { useStore } from 'src/store';
import moment from 'moment/moment';
import { ArticleEnum } from '../../config/types';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const cx = classNames.bind(styles);
const PAGE_NAME = 'contents';

export function ContentsTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [active, setActive] = useState(0);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);
  const [keyWorld, setKeyWorld] = useState('');
  const [params, setParams] = useState<paramProps>({
    page,
    size: 16,
    contentsType: contentTypes.length > 0 ? contentTypes[0].id : null,
  });
  const [contents, setContents] = useState<RecommendContent[]>([]);

  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));
  const { isFetched: isContentTypeFetched } = useContentTypes(data => {
    setContentTypes(data || []);
    const contentsType = data.length >= 0 && data[0].id;
    setParams({
      ...params,
      contentsType,
    });
  });
  const { isFetched: isContentFetched, isFetching } = useRecommendContents(PAGE_NAME, params, data => {
    setContents(data.data || []);
    setTotalPage(data.totalPage > 0 ? data.totalPage : 1);
  });

  useEffect(() => {
    if (isFetching) return;
    setParams({
      ...params,
      page,
      recommendJobGroups: jobGroupsFilter.join(','),
      recommendLevels: levelsFilter.join(','),
      keywords: keyWorld,
    });
  }, [page, jobGroupsFilter, levelsFilter, keyWorld]);

  const setNewCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

  const toggleFilter = (id, type: 'jobGroup' | 'level') => {
    if (type === 'jobGroup') {
      const index = jobGroupsFilter.indexOf(id);
      setJobGroupsFilter(prevState => setNewCheckItem(id, index, prevState));
    } else {
      const index = levelsFilter.indexOf(id);
      setLevelsFilter(prevState => setNewCheckItem(id, index, prevState));
    }
  };

  function searchKeyworld(value) {
    let _keyworld = value.replace('#', '');
    if (_keyworld == '') _keyworld = null;
    setKeyWorld(_keyworld);
  }
  const boxWidth = 60;
  return (
    <div className={cx('content-container')}>
      <Banner title="성장 콘텐츠 추천" subTitle="추천 커멘픽" imageName="top_banner_content.svg" />
      <div className={cx('content-container', 'container')}>
        <article>
          <div className={cx('filter-area', 'top-filter')}>
            <Grid
              container
              spacing={{
                xs: 0,
              }}
              sx={{ marginLeft: '0px', marginRight: '0px', marginBottom: '15px' }}
            >
              <Grid container item xs={8}>
                <div className={cx('filter-area')}>
                  <div className={cx('mentoring-button__group')}>
                    <Typography type="B1" bold>
                      직군
                    </Typography>
                    <Box width={boxWidth}>
                      <Toggle
                        label="전체"
                        name="mentoring"
                        value="ALL"
                        variant="small"
                        isActive
                        checked={jobGroupsFilter.length === 0}
                        type="checkBox"
                        onChange={() => {
                          setPage(1);
                          setJobGroupsFilter([]);
                        }}
                      />
                    </Box>
                    {isJobGroupFetched &&
                      jobGroups.map(item => (
                        <Box width={boxWidth} key={item.id}>
                          <Toggle
                            key={item.id}
                            label={item.name}
                            name={item.name}
                            value={item.id}
                            variant="small"
                            type="checkBox"
                            checked={jobGroupsFilter.indexOf(item.id) >= 0}
                            isActive
                            onChange={() => toggleFilter(item.id, 'jobGroup')}
                          />
                        </Box>
                      ))}
                  </div>
                  <div className={cx('mentoring-button__group')}>
                    <Typography type="B1" bold>
                      레벨
                    </Typography>
                    <Box width={boxWidth}>
                      <Toggle
                        label="전체"
                        name="mentoring"
                        value="ALL"
                        variant="small"
                        isActive
                        checked={levelsFilter.length === 0}
                        type="checkBox"
                        onChange={() => {
                          setPage(1);
                          setLevelsFilter([]);
                        }}
                      />
                    </Box>
                    {isJobGroupFetched &&
                      [1, 2, 3, 4, 5].map(level => (
                        <Box width={boxWidth} key={`level-${level}`}>
                          <Toggle
                            label={`${level}레벨`}
                            name={`level-${level}`}
                            value={level}
                            variant="small"
                            type="checkBox"
                            checked={levelsFilter.indexOf(level) >= 0}
                            isActive
                            onChange={() => toggleFilter(level, 'level')}
                          />
                        </Box>
                      ))}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className={cx('filter-area')}>
                  <div className={cx('mentoring-button__group', 'gap-12', 'justify-content-center')}>
                    <TextField
                      sx={{
                        width: 400,
                      }}
                      id="outlined-search"
                      label="#해시태그를 입력하세요."
                      type="search"
                      // onChange={e => {
                      //   something(e.target.value);
                      // }}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          searchKeyworld((e.target as HTMLInputElement).value);
                        }
                      }}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className={cx('filter-area')}>
            <div className={cx('mentoring-button__group', 'gap-12', 'justify-content-center')}>
              {isContentTypeFetched &&
                contentTypes.map((item, i) => (
                  <Toggle
                    key={item.id}
                    label={item.name}
                    name={item.name}
                    value={item.id}
                    variant="small"
                    checked={active === i}
                    isActive
                    type="tabButton"
                    onChange={() => {
                      setActive(i);
                      setParams({
                        ...params,
                        contentsType: item.id,
                        page: 1,
                        seminarEndDateFrom:
                          item.id === ArticleEnum.SEMINAR ? moment().format('YYYY-MM-DD HH:mm:ss.SSS') : null,
                      });
                      setPage(1);
                    }}
                    className={cx('fixed-width')}
                  />
                ))}
            </div>
          </div>

          <div className={cx('content-area')}>
            <section className={cx('content', 'flex-wrap-container')}>
              <Grid container spacing={{ xs: 1.5, md: 1.5, sm: 1.5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
                {isContentFetched &&
                  (contents.length > 0 ? (
                    contents.map((item, i) => {
                      return (
                        <Grid item xs={6} sm={6} md={3} key={i}>
                          <ArticleCard
                            uiType={item.contentsType}
                            content={item}
                            key={i}
                            className={cx('container__item')}
                          />
                        </Grid>
                      );
                    })
                  ) : (
                    <div className={cx('content--empty')}>데이터가 없습니다.</div>
                  ))}
              </Grid>
              {/* {isContentFetched &&
                (contents.length > 0 ? (
                  contents.map((item, i) => {
                    return (
                      <ArticleCard
                        uiType={item.contentsType}
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
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </article>
      </div>
    </div>
  );
}

export default ContentsTemplate;
