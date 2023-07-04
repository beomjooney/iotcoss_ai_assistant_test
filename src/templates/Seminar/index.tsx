import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Typography } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useSeminarList, paramProps, useSeminarImageList } from 'src/services/seminars/seminars.queries';
import ArticleCard from 'src/stories/components/ArticleCard';
import Carousel from 'nuka-carousel';
import { ArticleEnum } from '../../config/types';
import { useContentTypes, useJobGroups } from 'src/services/code/code.queries';
import Banner from '../../stories/components/Banner';
import { useStore } from 'src/store';
import { useRouter } from 'next/router';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Box from '@mui/system/Box';
import Image from 'next/image';

const cx = classNames.bind(styles);

export function SeminarTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);
  const [seminarFilter, setSeminarFilter] = useState(['0002']);
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [images, setSeminarImages] = useState<any[]>([]);

  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));

  const { isFetched: isContentFetched } = useSeminarList(params, data => {
    setContents(data.data || []);
    setTotalPage(data.totalPage);
  });

  const { isFetched: isContentImageFetched } = useSeminarImageList(data => {
    setSeminarImages(data || []);
  });

  const seminarType = [
    {
      label: '모집중',
      value: '0002',
    },
    {
      label: '진행예정',
      value: '0001',
    },
    {
      label: '신청마감',
      value: '0003',
    },
    {
      label: '진행완료',
      value: '0011',
    },
    {
      label: '진행연기',
      value: '0012',
    },
    {
      label: '진행취소',
      value: '0013',
    },
  ];
  useEffect(() => {
    setParams({
      ...params,
      page,
      recommendJobGroups: jobGroupsFilter.join(','),
      recommendLevels: levelsFilter.join(','),
      seminarStatus: seminarFilter.join(','),
    });
  }, [page, jobGroupsFilter, levelsFilter, seminarFilter]);

  const setNewCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

  const toggleFilter = (id, type: 'jobGroup' | 'level' | 'status') => {
    if (type === 'jobGroup') {
      const index = jobGroupsFilter.indexOf(id);
      setJobGroupsFilter(prevState => setNewCheckItem(id, index, prevState));
    } else if (type === 'level') {
      const index = levelsFilter.indexOf(id);
      setLevelsFilter(prevState => setNewCheckItem(id, index, prevState));
    } else {
      const index = seminarFilter.indexOf(id);
      setSeminarFilter(prevState => setNewCheckItem(id, index, prevState));
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const boxWidth = 110;
  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" imageName="top_banner_seminar.svg" /> */}
      <div className={cx('container')}>
        <Carousel
          autoplay={true}
          wrapAround={false}
          renderCenterRightControls={({ nextDisabled, nextSlide, goToSlide }) => (
            <button
              onClick={() => {
                if (nextDisabled) goToSlide(0);
                else nextSlide();
              }}
              className={cx('slide__button')}
            >
              <Icon component={ArrowForwardIosIcon}></Icon>
            </button>
          )}
          renderCenterLeftControls={({ previousDisabled, previousSlide, goToSlide, slideCount }) => (
            <button
              onClick={() => {
                if (previousDisabled) goToSlide(slideCount - 1);
                else previousSlide();
              }}
              className={cx('slide__button')}
            >
              <Icon component={ArrowBackIosNewIcon}></Icon>
            </button>
          )}
          slidesToShow={1}
          className={cx('carousel')}
        >
          {isContentImageFetched &&
            (images.length > 0 ? (
              images.map((item, i) => {
                return (
                  <Image
                    key={i}
                    width="1120px"
                    height="420px"
                    objectFit="cover"
                    unoptimized={true}
                    src={item.imageUrl}
                    alt="seminar_banner"
                    priority
                    onClick={() => router.push(item.linkUrl.toString())}
                  />
                );
              })
            ) : (
              <div className={cx('content--empty')}>데이터가 없습니다.</div>
            ))}
        </Carousel>
        <article>
          <div className={cx('filter-area', 'top-filter')}>
            <div className={cx('seminar-button__group')}>
              <Typography type="B1" bold>
                직군
              </Typography>
              <Box width={boxWidth}>
                <Toggle
                  className={cx('box-width')}
                  label="직군 전체"
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
                      className={cx('box-width')}
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
            <div className={cx('seminar-button__group')}>
              <Typography type="B1" bold>
                레벨
              </Typography>
              <Box width={boxWidth}>
                <Toggle
                  className={cx('box-width')}
                  label="레벨 전체"
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
                      className={cx('box-width')}
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
            <div className={cx('seminar-button__group')}>
              <Typography type="B1" bold>
                상태
              </Typography>
              <Box width={boxWidth}>
                <Toggle
                  className={cx('box-width')}
                  label="세미나 전체"
                  name="mentoring"
                  value="ALL"
                  variant="small"
                  isActive
                  checked={seminarFilter.length === 0}
                  type="checkBox"
                  onChange={() => {
                    setPage(1);
                    setSeminarFilter([]);
                  }}
                />
              </Box>
              {seminarType.map(status => (
                <Box width={boxWidth} key={`level-${status.value}`}>
                  <Toggle
                    className={cx('box-width')}
                    label={`${status.label}`}
                    name={`status-${status.value}`}
                    value={status.value}
                    variant="small"
                    type="checkBox"
                    checked={seminarFilter.indexOf(status.value) >= 0}
                    isActive
                    onChange={() => toggleFilter(status.value, 'status')}
                  />
                </Box>
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
                            uiType={ArticleEnum.MENTOR_SEMINAR}
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
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </article>
      </div>
    </div>
  );
}

export default SeminarTemplate;
