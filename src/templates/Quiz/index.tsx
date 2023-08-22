import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Toggle, Pagination, Typography, Chip } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useSeminarList, paramProps, useSeminarImageList } from 'src/services/seminars/seminars.queries';
import QuizArticleCard from 'src/stories/components/QuizArticleCard';
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SecondTabs from 'src/stories/components/Tab/SecondTab';
import ListItemtag from 'src/stories/components/QuizItemCard/ListItemTag';
import SecondTechLogCard from 'src/stories/components/QuizItemCard/SecondTechLogCard';
import Card6 from 'src/stories/components/QuizItemCard/Card6';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { jobColorKey } from 'src/config/colors';

interface BoardListItemType {
  id: number;
  name: string;
  boardType?: string;
  status: 'ACTIVE' | 'DEACTIVATED';
  layoutType: 'LIST' | 'IMAGE_TEXT' | 'IMAGE';
  enableHashtag: boolean;
  enableReply: boolean;
  index: number;
  articleCnt?: number;
}

const testBoards: BoardListItemType[] = [
  {
    id: 1,
    name: '전체보기',
    boardType: 'techlog',
    status: 'ACTIVE',
    layoutType: 'LIST',
    enableHashtag: true,
    enableReply: true,
    index: 1,
  },
  {
    id: 2,
    name: '개발',
    boardType: 'techlog',
    status: 'ACTIVE',
    layoutType: 'LIST',
    enableHashtag: true,
    enableReply: true,
    index: 2,
  },
  {
    id: 3,
    name: '엔지니어링',
    boardType: 'techlog',
    status: 'ACTIVE',
    layoutType: 'LIST',
    enableHashtag: true,
    enableReply: true,
    index: 2,
  },
  {
    id: 4,
    name: '기획/PM/PO',
    boardType: 'techlog',
    status: 'ACTIVE',
    layoutType: 'LIST',
    enableHashtag: true,
    enableReply: true,
    index: 2,
  },
  {
    id: 5,
    name: '디자인',
    boardType: 'techlog',
    status: 'ACTIVE',
    layoutType: 'LIST',
    enableHashtag: true,
    enableReply: true,
    index: 2,
  },
];

export type ArticleLikeUser = {
  userId: string;
  name: string;
  profileImageUrl: string;
};

export type Article = {
  articleId: number | string;
  title: string;
  boardId: number;
  boardName?: string;
  boardType?: string;
  hashtags?: string[]; //태그 리스트
  myLike?: boolean; // 내가 좋아요 눌렀는지 여부
  likeCnt?: number; //좋아요숫자
  likeUsers?: ArticleLikeUser[]; // 좋아요 유저리스트
  replyCnt?: number;
  viewCnt?: number;
  group?: string;
  name: string;
  userId: string;
  profileImageUrl?: string;
  body?: string; // html
  imageFileUrls?: string[];
  imageFiles?: string[];
  previewText?: string;
  previewImageUrl?: string;
  previewImageFilename?: string;
  createDate?: string;
  updateDate: string;
};

const Articles = [
  {
    index: 8,
    id: '9f1739eb-8f00-4c99-97f4-63544b6a2d12',
    featuredImage:
      'https://images.unsplash.com/photo-1504992963429-56f2d62fbff0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODN8fHRlY2hub2xvZ3l8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    title: '백엔드 개발자 오세요.',
    desc: 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.',
    date: 'May 20, 2021',
    href: '/single-audio/this-is-single-slug',
    commentCount: 18,
    viewdCount: 3800,
    readingTime: 5,
    bookmark: { count: 1168, isBookmarked: false },
    like: { count: 1255, isLiked: true },
    author: {
      id: 1,
      firstName: 'Alric',
      lastName: 'Truelock',
      displayName: 'Truelock Alric',
      email: 'atruelock0@skype.com',
      gender: 'Bigender',
      avatar: 'https://robohash.org/doloremaliquidquia.png?size=150x150&set=set1',
      bgImage:
        'https://images.pexels.com/photos/912410/pexels-photo-912410.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      count: 40,
      href: '/author/the-demo-author-slug',
      desc: 'There’s no stopping the tech giant. Apple now opens its 100th store in China.There’s no stopping the tech giant.',
      jobName: 'Author Job',
    },
    categories: [
      {
        id: 3,
        name: 'Industrial',
        href: '/archive/the-demo-archive-slug',
        thumbnail:
          'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        count: 15,
        color: 'yellow',
      },
    ],
    postType: 'audio',
    audioUrl: 'https://chisnghiax.com/ncmaz_mp3/Alan_Walker_-_AloneMP3_128K.mp3',
  },
  {
    index: 9,
    id: '0991ab0b-696f-4d7f-afe7-9c624eb8c050',
    featuredImage:
      'https://images.unsplash.com/photo-1465310477141-6fb93167a273?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    title: '고급 프론트엔드와 성장퀴즈',
    desc: 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.',
    date: 'May 20, 2021',
    href: '/single/this-is-single-slug',
    commentCount: 19,
    viewdCount: 4515,
    readingTime: 3,
    bookmark: { count: 3463, isBookmarked: true },
    like: { count: 2586, isLiked: false },
    author: {
      id: 1,
      firstName: 'Alric',
      lastName: 'Truelock',
      displayName: 'Truelock Alric',
      email: 'atruelock0@skype.com',
      gender: 'Bigender',
      avatar: 'https://robohash.org/doloremaliquidquia.png?size=150x150&set=set1',
      bgImage:
        'https://images.pexels.com/photos/912410/pexels-photo-912410.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      count: 40,
      href: '/author/the-demo-author-slug',
      desc: 'There’s no stopping the tech giant. Apple now opens its 100th store in China.There’s no stopping the tech giant.',
      jobName: 'Author Job',
    },
    categories: [
      {
        id: 3,
        name: 'Industrial',
        href: '/archive/the-demo-archive-slug',
        thumbnail:
          'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        count: 15,
        color: 'yellow',
      },
    ],
    postType: 'standard',
  },
  {
    index: 10,
    id: 'eae0e85d-db11-44fa-ac32-6c192f687e0c',
    featuredImage:
      'https://images.unsplash.com/photo-1581122584612-713f89daa8eb?ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    title: '고급 프론트엔드 성장퀴즈',
    desc: 'We’re an online magazine dedicated to covering the best in international product design. We started as a little blog back in 2002 covering student work and over time',
    date: 'May 20, 2021',
    href: '/single/this-is-single-slug',
    commentCount: 14,
    viewdCount: 2378,
    readingTime: 6,
    bookmark: { count: 3502, isBookmarked: false },
    like: { count: 773, isLiked: true },
    author: {
      id: 1,
      firstName: 'Alric',
      lastName: 'Truelock',
      displayName: 'Truelock Alric',
      email: 'atruelock0@skype.com',
      gender: 'Bigender',
      avatar: 'https://robohash.org/doloremaliquidquia.png?size=150x150&set=set1',
      bgImage:
        'https://images.pexels.com/photos/912410/pexels-photo-912410.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      count: 40,
      href: '/author/the-demo-author-slug',
      desc: 'There’s no stopping the tech giant. Apple now opens its 100th store in China.There’s no stopping the tech giant.',
      jobName: 'Author Job',
    },
    categories: [
      {
        id: 3,
        name: 'Industrial',
        href: '/archive/the-demo-archive-slug',
        thumbnail:
          'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        count: 15,
        color: 'yellow',
      },
    ],
    postType: 'standard',
  },
  {
    index: 10,
    id: 'eae0e85d-db11-44fa-ac32-6c192f687e0c',
    featuredImage:
      'https://images.unsplash.com/photo-1581122584612-713f89daa8eb?ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    title: '개발공부 이모저모',
    desc: 'We’re an online magazine dedicated to covering the best in international product design. We started as a little blog back in 2002 covering student work and over time',
    date: 'May 20, 2021',
    href: '/single/this-is-single-slug',
    commentCount: 14,
    viewdCount: 2378,
    readingTime: 6,
    bookmark: { count: 3502, isBookmarked: false },
    like: { count: 773, isLiked: true },
    author: {
      id: 1,
      firstName: 'Alric',
      lastName: 'Truelock',
      displayName: 'Truelock Alric',
      email: 'atruelock0@skype.com',
      gender: 'Bigender',
      avatar: 'https://robohash.org/doloremaliquidquia.png?size=150x150&set=set1',
      bgImage:
        'https://images.pexels.com/photos/912410/pexels-photo-912410.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      count: 40,
      href: '/author/the-demo-author-slug',
      desc: 'There’s no stopping the tech giant. Apple now opens its 100th store in China.There’s no stopping the tech giant.',
      jobName: 'Author Job',
    },
    categories: [
      {
        id: 3,
        name: 'Industrial',
        href: '/archive/the-demo-archive-slug',
        thumbnail:
          'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        count: 15,
        color: 'yellow',
      },
    ],
    postType: 'standard',
  },
  {
    index: 10,
    id: 'eae0e85d-db11-44fa-ac32-6c192f687e0c',
    featuredImage:
      'https://images.unsplash.com/photo-1581122584612-713f89daa8eb?ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    title: '개발공부 이모저모',
    desc: 'We’re an online magazine dedicated to covering the best in international product design. We started as a little blog back in 2002 covering student work and over time',
    date: 'May 20, 2021',
    href: '/single/this-is-single-slug',
    commentCount: 14,
    viewdCount: 2378,
    readingTime: 6,
    bookmark: { count: 3502, isBookmarked: false },
    like: { count: 773, isLiked: true },
    author: {
      id: 1,
      firstName: 'Alric',
      lastName: 'Truelock',
      displayName: 'Truelock Alric',
      email: 'atruelock0@skype.com',
      gender: 'Bigender',
      avatar: 'https://robohash.org/doloremaliquidquia.png?size=150x150&set=set1',
      bgImage:
        'https://images.pexels.com/photos/912410/pexels-photo-912410.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      count: 40,
      href: '/author/the-demo-author-slug',
      desc: 'There’s no stopping the tech giant. Apple now opens its 100th store in China.There’s no stopping the tech giant.',
      jobName: 'Author Job',
    },
    categories: [
      {
        id: 3,
        name: 'Industrial',
        href: '/archive/the-demo-archive-slug',
        thumbnail:
          'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        count: 15,
        color: 'yellow',
      },
    ],
    postType: 'standard',
  },
  {
    index: 10,
    id: 'eae0e85d-db11-44fa-ac32-6c192f687e0c',
    featuredImage:
      'https://images.unsplash.com/photo-1581122584612-713f89daa8eb?ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    title: '개발공부 이모저모',
    desc: 'We’re an online magazine dedicated to covering the best in international product design. We started as a little blog back in 2002 covering student work and over time',
    date: 'May 20, 2021',
    href: '/single/this-is-single-slug',
    commentCount: 14,
    viewdCount: 2378,
    readingTime: 6,
    bookmark: { count: 3502, isBookmarked: false },
    like: { count: 773, isLiked: true },
    author: {
      id: 1,
      firstName: 'Alric',
      lastName: 'Truelock',
      displayName: 'Truelock Alric',
      email: 'atruelock0@skype.com',
      gender: 'Bigender',
      avatar: 'https://robohash.org/doloremaliquidquia.png?size=150x150&set=set1',
      bgImage:
        'https://images.pexels.com/photos/912410/pexels-photo-912410.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      count: 40,
      href: '/author/the-demo-author-slug',
      desc: 'There’s no stopping the tech giant. Apple now opens its 100th store in China.There’s no stopping the tech giant.',
      jobName: 'Author Job',
    },
    categories: [
      {
        id: 3,
        name: 'Industrial',
        href: '/archive/the-demo-archive-slug',
        thumbnail:
          'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        count: 15,
        color: 'yellow',
      },
    ],
    postType: 'standard',
  },
  {
    index: 10,
    id: 'eae0e85d-db11-44fa-ac32-6c192f687e0c',
    featuredImage:
      'https://images.unsplash.com/photo-1581122584612-713f89daa8eb?ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    title: '개발공부 이모저모',
    desc: 'We’re an online magazine dedicated to covering the best in international product design. We started as a little blog back in 2002 covering student work and over time',
    date: 'May 20, 2021',
    href: '/single/this-is-single-slug',
    commentCount: 14,
    viewdCount: 2378,
    readingTime: 6,
    bookmark: { count: 3502, isBookmarked: false },
    like: { count: 773, isLiked: true },
    author: {
      id: 1,
      firstName: 'Alric',
      lastName: 'Truelock',
      displayName: 'Truelock Alric',
      email: 'atruelock0@skype.com',
      gender: 'Bigender',
      avatar: 'https://robohash.org/doloremaliquidquia.png?size=150x150&set=set1',
      bgImage:
        'https://images.pexels.com/photos/912410/pexels-photo-912410.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      count: 40,
      href: '/author/the-demo-author-slug',
      desc: 'There’s no stopping the tech giant. Apple now opens its 100th store in China.There’s no stopping the tech giant.',
      jobName: 'Author Job',
    },
    categories: [
      {
        id: 3,
        name: 'Industrial',
        href: '/archive/the-demo-archive-slug',
        thumbnail:
          'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        count: 15,
        color: 'yellow',
      },
    ],
    postType: 'standard',
  },
  {
    index: 10,
    id: 'eae0e85d-db11-44fa-ac32-6c192f687e0c',
    featuredImage:
      'https://images.unsplash.com/photo-1581122584612-713f89daa8eb?ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    title: '개발공부 이모저모',
    desc: 'We’re an online magazine dedicated to covering the best in international product design. We started as a little blog back in 2002 covering student work and over time',
    date: 'May 20, 2021',
    href: '/single/this-is-single-slug',
    commentCount: 14,
    viewdCount: 2378,
    readingTime: 6,
    bookmark: { count: 3502, isBookmarked: false },
    like: { count: 773, isLiked: true },
    author: {
      id: 1,
      firstName: 'Alric',
      lastName: 'Truelock',
      displayName: 'Truelock Alric',
      email: 'atruelock0@skype.com',
      gender: 'Bigender',
      avatar: 'https://robohash.org/doloremaliquidquia.png?size=150x150&set=set1',
      bgImage:
        'https://images.pexels.com/photos/912410/pexels-photo-912410.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      count: 40,
      href: '/author/the-demo-author-slug',
      desc: 'There’s no stopping the tech giant. Apple now opens its 100th store in China.There’s no stopping the tech giant.',
      jobName: 'Author Job',
    },
    categories: [
      {
        id: 3,
        name: 'Industrial',
        href: '/archive/the-demo-archive-slug',
        thumbnail:
          'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        count: 15,
        color: 'yellow',
      },
    ],
    postType: 'standard',
  },
];

const boardTags: string[] = ['모든', '트렌드', '질문', '소프트웨어', '프로세스'];

const cx = classNames.bind(styles);

export function QuizTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();

  const router = useRouter();
  const [skillIds, setSkillIds] = useState<any[]>([]);
  const [skillIdsClk, setSkillIdsClk] = useState<any[]>([1, 2, 3, 4, 5]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);
  const [seminarFilter, setSeminarFilter] = useState(['0002']);
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [images, setSeminarImages] = useState<any[]>([]);

  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));

  const { isFetched: isContentFetched } = useSeminarList(params, data => {
    console.log('quiz club : ', data.data.data.contents);
    setContents(data.data.data.contents || []);
    setTotalPage(data.data.totalPage);
  });

  useEffect(() => {
    console.log(skillIds);
  }, [skillIds]);

  const { isFetched: isContentImageFetched } = useSeminarImageList(data => {
    setSeminarImages(data || []);
  });

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.currentTarget;
    console.log(value, checked);
    if (checked) {
      setSkillIds([1, 2, 3, 4, 5]);
    } else {
      setSkillIds([]);
    }
    console.log(skillIds);
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const result = [...skillIds];

    if (result.indexOf(value) > -1) {
      result.splice(result.indexOf(value), 1);
    } else {
      result.push(value);
    }
    setSkillIds(result);
    console.log(skillIds);
    // setJobGroup(value);
  };

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
      // recommendJobGroups: jobGroupsFilter.join(','),
      // recommendLevels: levelsFilter.join(','),
      // seminarStatus: seminarFilter.join(','),
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
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleClick = (article: Article) => {
    if (window.innerWidth < 768) {
      const paramObj = {
        articleId: article.articleId.toString(),
        boardId: article.boardId.toString(),
      };
    } else {
    }
  };

  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black">
              성장퀴즈
            </Grid>
            <Grid item xs={7} className="tw-font-semi tw-text-base tw-text-black">
              관심 주제별로 성장 퀴즈를 풀고 네트워킹 할 수 있는 클럽을 만나보세요!
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                type="button"
                className="tw-text-white tw-bg-blue-500 hover:tw-bg-blue-800 tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
              >
                <Link href="/quiz/open" className="nav-link">
                  성장퀴즈 클럽 개설하기 +
                </Link>
              </button>
            </Grid>
          </Grid>
        </div>
        <Box sx={{ width: '100%', typography: 'body1', marginTop: '20px', marginBottom: '20px' }}>
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={8} className="tw-font-bold tw-text-3xl tw-text-black">
              <SecondTabs tabs={testBoards} />
            </Grid>
            <Grid item xs={4} className="tw-font-semi tw-text-base tw-text-black">
              <TextField
                fullWidth
                id="outlined-basic"
                label=""
                variant="outlined"
                InputProps={{
                  style: { height: '43px' },
                  startAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider className="tw-mb-6 tw-border tw-bg-['#efefef']" />

        <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
          <span className="tw-font-bold tw-text-base tw-text-black tw-mr-4">직무</span>
          <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
            모든직무
          </span>
          <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
            백엔드개발자
          </span>
          <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
            프론트개발자
          </span>
          <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
            모바일개발자
          </span>
          <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
            AI개발자
          </span>
        </div>

        <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
          <span className="tw-font-bold tw-text-base tw-text-black tw-mr-4">레벨</span>
          <Toggle
            className="tw-mr-3 tw-text-black"
            key={`custom-skill-13`}
            label={'모든 레벨'}
            name="skillIds"
            value={13}
            onChange={handleToggleAll}
            variant="small"
            type="multiple"
            isActive
            defaultChecked={false}
          />
          {skillIdsClk?.map((item, index) => {
            return (
              <Toggle
                className="tw-mr-3 tw-text-black"
                key={`custom-skill-${index}`}
                label={item + ' 레벨'}
                name={item}
                value={item}
                onChange={handleToggle}
                variant="small"
                type="multiple"
                isActive
                // defaultChecked={!!skillIds?.find(_ => _ === item)}
                defaultChecked={skillIds.includes(item)}
              />
            );
          })}
          {/* <span className="tw-font-bold tw-text-base tw-text-black tw-mr-4">레벨</span>
          <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
            모든레벨
          </span>
          <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
            레벨0
          </span>
          <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
            레벨1
          </span>
          <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
            레벨2
          </span>
          <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
            레벨3
          </span> */}
        </div>

        <article>
          {/* <div className={cx('filter-area', 'top-filter')}>
            <div className={cx('seminar-button__group')}></div>
          </div> */}

          <div className={cx('content-area')}>
            <section className={cx('content', 'flex-wrap-container')}>
              <Grid
                container
                direction="row"
                justifyContent="left"
                alignItems="center"
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {isContentFetched &&
                  (contents.length > 0 ? (
                    contents.map((item, index) => {
                      return (
                        <Grid key={index} item xs={6}>
                          <a
                            href={'/quiz/' + `${index}`}
                            className="tw-flex tw-flex-col tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow md:tw-flex-row md:tw-max-w-xl hover:tw-bg-gray-100 dark:tw-border-gray-700 dark:tw-bg-gray-800 dark:hover:tw-bg-gray-700"
                          >
                            <img
                              className="tw-object-cover tw-w-[220px] tw-rounded-t-lg tw-h-[245px] md:tw-h-[245px] md:tw-w-[220px] md:tw-rounded-none md:tw-rounded-l-lg"
                              src="/assets/images/banner/Rectangle1.png"
                              alt=""
                            />
                            <div className="tw-flex tw-flex-col tw-justify-between tw-p-4 tw-leading-normal">
                              <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                                {item?.recommendJobGroups.map((name, i) => (
                                  <Chip
                                    key={`job_${i}`}
                                    chipColor={jobColorKey(item?.recommendJobGroups[i])}
                                    radius={4}
                                    variant="outlined"
                                  >
                                    {name}
                                  </Chip>
                                ))}
                              </div>
                              <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                                {item?.relatedExperiences.map((name, i) => (
                                  <Chip
                                    key={`job_${i}`}
                                    chipColor={jobColorKey(item?.relatedExperiences[i])}
                                    radius={4}
                                    variant="outlined"
                                  >
                                    {name}
                                  </Chip>
                                ))}
                              </div>
                              <div className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
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
                                {item.studyCycle.toString()} | {item.studyWeekCount} 주 | 학습 {item.recruitMemberCount}
                                회
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

export default QuizTemplate;
