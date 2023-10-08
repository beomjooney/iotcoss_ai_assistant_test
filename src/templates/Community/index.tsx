import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Banner from 'src/stories/components/Banner';
import { Textfield, Button, CommunityCard, Profile, Toggle, Chip, Typography } from 'src/stories/components';
import React, { useState, useEffect } from 'react';
import { BoardType, ReplyType } from '../../config/entities';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useRouter } from 'next/router';
import {
  paramProps,
  useCommunityList,
  usePopularPostList,
  usePopularKeyWorldList,
  usePopularMentoList,
  usePopularPostSearchList,
} from 'src/services/community/community.queries';
import InfiniteScroll from 'react-infinite-scroll-component';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { useSessionStore } from 'src/store/session';
import { useContentTypes, useJobGroups } from 'src/services/code/code.queries';
import { useStore } from 'src/store';
import { useDeletePost } from 'src/services/community/community.mutations';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const { memberId, logged } = useSessionStore.getState();
const cx = classNames.bind(styles);

const memberSample = {
  memberId: 'memberId1@email.com',
  name: '회원1',
  nickname: '닉네임1',
  email: 'memberId1@email.com',
  ageRange: '30~39',
  birthday: '0123',
  type: '0001',
  jobGroup: '0001',
  level: 3,
  profileImageUrl: 'profile@test.com',
  authProvider: 'KAKAO',
  snsUrl: ['sns@test.com'],
  loginFailCount: 0,
};

export function CommunityTemplate() {
  const { jobGroups, setJobGroups } = useStore();
  const [hasMore, setHasMore] = useState(true);
  const [afterCursor, setAfterCursor] = useState(null);
  const [page, setPage] = useState(0);
  const [postNo, setPostNo] = useState(0);
  const [params, setParams] = useState<paramProps>({});
  const [datas, setData] = useState([]);
  const [popularPostDetail, setPopularPostSearchDetail] = useState([]);
  const [popularPostList, setPopularPostList] = useState([]);
  const [popularKeyWorldList, setPopularKeyWorldList] = useState([]);
  const [popularMentoList, setPopularMentoList] = useState<any>();
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]); // TODO 개발 필요
  const [popularPostSearch, setPopularPostSearch] = useState(false); // TODO 개발 필요
  const PAGE_NAME = 'community';

  const {
    isFetched: isCommunityFetched,
    refetch,
    data: communityData,
  } = useCommunityList(PAGE_NAME, params, data => {
    // console.log('------------------- init : ', page, data.nextCursor, isNaN(data.nextCursor));
    setAfterCursor(data.nextCursor);
    setHasMore(true);
    if (page > 0) {
      let test = datas?.concat(data?.data);
      setData(test);
    } else {
      setData(data?.data);
    }
  });
  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));
  const { isFetched: isPopularPostFetched } = usePopularPostList(data => setPopularPostList(data));
  const { isFetched: isPopularKeyWorldFetched } = usePopularKeyWorldList(data => setPopularKeyWorldList(data));
  const { isFetched: isPopularMentoFetched } = usePopularMentoList(data => setPopularMentoList(data));
  const { mutate: onDeletePost, isSuccess: deletePostSucces } = useDeletePost();
  const { isFetched: isPopularPostSearchFetched, refetch: popularPostSearchRefetch } = usePopularPostSearchList(
    postNo,
    data => {
      setPopularPostSearchDetail([data?.data]);
    },
  );

  useDidMountEffect(() => {
    setPage(0);
    setAfterCursor(null);
    refetch();
  }, [deletePostSucces]);

  useDidMountEffect(() => {
    popularPostSearchRefetch();
  }, [postNo]);

  useDidMountEffect(() => {
    setParams({
      ...params,
      afterCursor: null,
      relatedJobGroups: jobGroupsFilter.join(','),
      recommendLevels: levelsFilter.join(','),
    });
  }, [jobGroupsFilter, levelsFilter]);

  useDidMountEffect(() => {
    setParams({
      ...params,
      afterCursor,
      relatedJobGroups: jobGroupsFilter.join(','),
      recommendLevels: levelsFilter.join(','),
    });
  }, [page]);

  const onPostDeleteSubmit = (postNo: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      window.scrollTo(0, 0);
      onDeletePost({
        postNo: postNo,
      });
    }
  };

  //인기목록 커뮤니티 클릭
  const onPopularPostClick = postNo => {
    window.scrollTo(0, 0);
    setPostNo(postNo);
    setPopularPostSearch(true);
  };

  //커뮤니티 목록 돌아가기
  const backCommunityWriteList = () => {
    setPopularPostSearch(false);
  };

  const onWriteSubmit = () => {
    if (logged) router.push('community/write');
    else alert('로그인 후 커뮤니티글을 입력할 수 있습니다.');
  };

  const setNewCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

  const toggleFilter = (id, type: 'jobGroup' | 'level') => {
    setPage(0);
    setAfterCursor('');
    if (type === 'jobGroup') {
      const index = jobGroupsFilter.indexOf(id);
      setJobGroupsFilter(prevState => setNewCheckItem(id, index, prevState));
    } else {
      const index = levelsFilter.indexOf(id);
      setLevelsFilter(prevState => setNewCheckItem(id, index, prevState));
    }
  };

  const fetchMoreData = () => {
    if (!communityData?.nextCursor) {
      setHasMore(false);
      return;
    }
    setPage(p => p + 1);
  };

  const router = useRouter();
  const popularityContent = (item, key) => {
    return (
      <a
        href="#"
        key={key}
        className={cx('item', 'row', 'text-black-50')}
        onClick={() => onPopularPostClick(item.postNo)}
      >
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={4}>
            <img
              src={
                item.author?.profileImageUrl.indexOf('http') > -1
                  ? item.author?.profileImageUrl
                  : `${process.env['NEXT_PUBLIC_GENERAL_API_URL']}/images/${item.author?.profileImageUrl}`
              }
              alt={`${item.author.nickname}`}
              className={cx('rounded-circle', 'profile-image')}
            />
            <span className={cx('item-content__text')}>{item.author.name}</span>
          </Grid>
          <Grid item xs={8}>
            <div className={cx('item-content__header')}>
              <span className={cx('item-content__header-heart')}>
                <FavoriteBorderIcon color="disabled" fontSize="small" />
                {item.likeReactionCount}
              </span>
              <span className={cx('item-content__header-date')}>{item.createdAt.split(' ')[0]}</span>
            </div>
            <div className={cx('item-content__text')}>{item.body.replace(/(<([^>]+)>)/gi, '')}</div>
            <div className={cx('item-content__tags')}>
              <ul className="list-inline meta-list">
                {item.keywords.map(tag => (
                  <li className="list-inline-item" key={tag}>
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
          </Grid>
        </Grid>
      </a>
    );
  };
  const boxWidth = 60;
  return (
    <div className={cx('community-container')}>
      <Banner title="커뮤니티" subTitle="커멘니티" imageName="top_banner_community.svg" />
      <div className={cx('service-container', 'container')}>
        <article>
          {/*todo 컴포넌트 분리 필요 -> 기획 확정안 답변 올 경우 = 커리어멘토링/추천 서비스에 일괄 적용*/}
          <div className={cx('filter-area', 'pt-5')}>
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
                    setLevelsFilter([]);
                  }}
                />
              </Box>
              {isJobGroupFetched &&
                [1, 2, 3, 4, 5].map(level => (
                  <Box width={boxWidth} key={`level-${level}`}>
                    <Toggle
                      key={`level-${level}`}
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
            {/* <div className="col-md-4">
              <Textfield defaultValue="" placeholder="키워드로 검색해보세요." />
            </div> */}
          </div>
        </article>
        <div className={cx('main-container', 'row')}>
          <section className={cx('reply-container', 'col-md-9')}>
            {!popularPostSearch ? (
              <InfiniteScroll
                dataLength={datas?.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4></h4>}
                endMessage={<div style={{ textAlign: 'center' }}></div>}
              >
                {datas?.map((item, i) => (
                  <CommunityCard
                    key={i}
                    board={item}
                    writer={memberSample}
                    className={cx('reply-container__item')}
                    memberId={memberId}
                    onPostDeleteSubmit={onPostDeleteSubmit}
                  />
                ))}
              </InfiniteScroll>
            ) : (
              popularPostDetail?.map((item, i) => (
                <div key={i}>
                  <CommunityCard
                    key={i}
                    board={item}
                    writer={memberSample}
                    className={cx('reply-container__item')}
                    memberId={memberId}
                    onPostDeleteSubmit={onPostDeleteSubmit}
                  />
                  <div className="text-center">
                    <Button label="커뮤니티 글쓰기" size="large" onClick={() => backCommunityWriteList()}>
                      커뮤니티 목록으로 돌아가기
                    </Button>
                  </div>
                </div>
              ))
            )}
            {datas?.length === 0 && <div className="text-center">데이터가 없습니다.</div>}
          </section>
          <nav className={cx('nav-container', 'col-md-3', 'mt-3')}>
            <Button label="커뮤니티 글쓰기" size="large" onClick={() => onWriteSubmit()}>
              커뮤니티 글쓰기
              <span className="ti-pencil white pl-2" />
            </Button>
            <div className={cx('popular-article-area')}>
              <h3>인기글</h3>
              <div>
                {isPopularPostFetched && popularPostList?.map((item, key) => popularityContent(item, key))}
                {popularPostList?.length === 0 && <div className="text-center">데이터가 없습니다.</div>}
              </div>
            </div>
            <div className={cx('popular-mentor-area')}>
              <h3>인기 멘토</h3>
              {isPopularMentoFetched && (
                <Profile colorMode="primary" mentorInfo={popularMentoList} showDesc lgSize="col-lg-12" />
              )}
            </div>
            <div className={cx('popular-keyword-area')}>
              <h3>인기 키워드</h3>
              <ul className="list-inline meta-list">
                {isPopularKeyWorldFetched &&
                  popularKeyWorldList?.map((keyword, i) => (
                    <li className="list-inline-item" key={keyword}>
                      #{keyword}
                    </li>
                    // <Chip
                    //   key={i}
                    //   chipColor="black"
                    //   radius={4}
                    //   variant="outlined"
                    //   className={cx('popular-keyword-area__item')}
                    // >
                    //   {keyword}
                    // </Chip>
                  ))}
                {popularKeyWorldList?.length === 0 && <div className="text-center">데이터가 없습니다.</div>}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default CommunityTemplate;
