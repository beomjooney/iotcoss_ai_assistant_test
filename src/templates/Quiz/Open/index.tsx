import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { MentorsModal, Pagination, Typography } from 'src/stories/components';
import React, { useEffect, useState } from 'react';
import { RecommendContent, SeminarImages } from 'src/models/recommend';
import { useSeminarList, paramProps, useSeminarImageList } from 'src/services/seminars/seminars.queries';
import QuizArticleCard from 'src/stories/components/QuizArticleCard';
import Carousel from 'nuka-carousel';
import { useContentTypes, useJobGroups } from 'src/services/code/code.queries';
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
import TextField, { TextFieldProps } from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ToggleButton from 'src/stories/components/ToggleButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import { DateTimePicker, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';

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

export function QuizOpenTemplate() {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();

  const [searchParams, setSearchParams] = useState({});

  const onChangeKeyword = event => {
    const { name, value } = event.currentTarget;

    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const onChange = (name, value) => {
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const timeValues = {
    from: '00:00:00.000',
    to: '23:59:00.000',
  };
  const [today, setToday] = React.useState<Dayjs | null>(dayjs());
  const [todayEnd, setTodayEnd] = React.useState<Dayjs | null>(dayjs());
  const onChangeHandleFromToStartDate = date => {
    let formattedDate = date?.format('YYYY-MM-DD');
    setToday(formattedDate);
    console.log(formattedDate);
    // if (!formattedDate) {
    //   let time = timeValues[item?.dateType] || '00:00:00.000';
    //   let datetime = `${formattedDate} ${time}`;
    //   setSearchParams({
    //     ...searchParams,
    //     [item?.name]: '',
    //   });
    // } else {
    //   let time = timeValues[item?.dateType] || '00:00:00.000';
    //   let datetime = `${formattedDate} ${time}`;
    //   setSearchParams({
    //     ...searchParams,
    //     [item?.name]: datetime,
    //   });
    // }
  };
  const onChangeHandleFromToEndDate = date => {
    let formattedDate = date?.format('YYYY-MM-DD');
    setTodayEnd(formattedDate);
    console.log(formattedDate);
    // if (!formattedDate) {
    //   let time = timeValues[item?.dateType] || '00:00:00.000';
    //   let datetime = `${formattedDate} ${time}`;
    //   setSearchParams({
    //     ...searchParams,
    //     [item?.name]: '',
    //   });
    // } else {
    //   let time = timeValues[item?.dateType] || '00:00:00.000';
    //   let datetime = `${formattedDate} ${time}`;
    //   setSearchParams({
    //     ...searchParams,
    //     [item?.name]: datetime,
    //   });
    // }
  };

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]);

  const [seminarFilter, setSeminarFilter] = useState(['0002']);
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [images, setSeminarImages] = useState<any[]>([]);
  const [introductionMessage, setIntroductionMessage] = useState<string>('');

  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));

  const { isFetched: isContentFetched } = useSeminarList(params, data => {
    setContents(data.data || []);
    setTotalPage(data.totalPage);
  });

  const { isFetched: isContentImageFetched } = useSeminarImageList(data => {
    setSeminarImages(data || []);
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddClick = () => {
    // onGetJobsData && onGetJobsData();
    console.log('modal ');
    setIsModalOpen(true);
    // setChapterNo(chapterNo);
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
  const [jobGroup, setJobGroup] = useState([]);
  const [studyCycle, setStudyCycle] = useState([]);
  const [recommendJobGroups, setRecommendJobGroups] = useState([]);
  const [recommendLevels, setRecommendLevels] = useState([]);
  const [clubName, setClubName] = useState<string>('');

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handleToggleDay = event => {
    const { name, value } = event.currentTarget;
    setStudyCycle([]);
    const result = [...studyCycle];
    if (result.indexOf(value) > -1) {
      result.splice(result.indexOf(value), 1);
    } else {
      result.push(value);
    }
    setStudyCycle(result);
  };

  const handleToggle = event => {
    const { name, value } = event.currentTarget;
    setJobGroup([]);
    const result = [...jobGroup];
    if (result.indexOf(value) > -1) {
      result.splice(result.indexOf(value), 1);
    } else {
      result.push(value);
    }
    setJobGroup(result);
  };

  const handleToggleRecommandJobGroup = event => {
    const { name, value } = event.currentTarget;
    setRecommendJobGroups([]);
    const result = [...recommendJobGroups];
    if (result.indexOf(value) > -1) {
      result.splice(result.indexOf(value), 1);
    } else {
      result.push(value);
    }
    setRecommendJobGroups(result);
  };

  const handleToggleRecommandLevels = event => {
    const { name, value } = event.currentTarget;
    setRecommendLevels([]);
    const result = [...recommendJobGroups];
    if (result.indexOf(value) > -1) {
      result.splice(result.indexOf(value), 1);
    } else {
      result.push(value);
    }
    setRecommendJobGroups(result);
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

  const steps = [
    'Step1. 클럽 개설 약속',
    'Step2. 클럽 세부사항 설정',
    'Step3. 성장 퀴즈 선택',
    'Step4. 개설한 성장 미리보기',
  ];

  const jobGroupIdx = [
    {
      id: '0100',
      groupId: '0001',
      name: '기획',
      description: '기획',
      order: 1,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0200',
      groupId: '0001',
      name: '디자인',
      description: '디자인',
      order: 2,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0300',
      groupId: '0001',
      name: '개발',
      description: '개발',
      order: 3,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0400',
      groupId: '0001',
      name: '엔지니어링',
      description: '엔지니어링',
      order: 4,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
  ];

  const jobGroup1 = [
    {
      id: '0100',
      groupId: '0001',
      name: '프론트엔드 개발자',
      description: '프론트엔드 개발자',
      order: 1,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0200',
      groupId: '0001',
      name: '백엔드 개발자',
      description: '백엔드 개발자',
      order: 2,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0300',
      groupId: '0001',
      name: 'AI 개발',
      description: 'AI 개발',
      order: 3,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0400',
      groupId: '0001',
      name: '상관없음',
      description: '상관없음',
      order: 4,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
  ];

  const levelGroup = [
    {
      id: '0100',
      groupId: '0001',
      name: '레벨 0',
      description: '레벨 0',
      order: 1,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0200',
      groupId: '0001',
      name: '레벨 1',
      description: '레벨 1',
      order: 2,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0300',
      groupId: '0001',
      name: '레벨 2',
      description: '레벨 2',
      order: 3,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0301',
      groupId: '0001',
      name: '레벨 3',
      description: '레벨 3',
      order: 3,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0302',
      groupId: '0001',
      name: '레벨 4',
      description: '레벨 4',
      order: 3,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0400',
      groupId: '0001',
      name: '상관없음',
      description: '상관없음',
      order: 4,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
  ];

  const dayGroup = [
    {
      id: '0100',
      groupId: '0001',
      name: '월',
      description: '월',
      order: 1,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0200',
      groupId: '0001',
      name: '화',
      description: '화',
      order: 2,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0300',
      groupId: '0001',
      name: '수',
      description: '수',
      order: 3,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0301',
      groupId: '0001',
      name: '목',
      description: '목',
      order: 3,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0302',
      groupId: '0001',
      name: '금',
      description: '금',
      order: 3,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0400',
      groupId: '0001',
      name: '토',
      description: '토',
      order: 4,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0401',
      groupId: '0001',
      name: '일',
      description: '일',
      order: 4,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
  ];

  const privateGroup = [
    {
      id: '0100',
      groupId: '0001',
      name: '공개',
      description: '공개',
      active: true,
      order: 1,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
    {
      id: '0200',
      groupId: '0001',
      name: '비공개',
      description: '비공개',
      active: false,
      order: 2,
      createdAt: '2022-10-14 15:46:30.123',
      updatedAt: '2022-10-14 15:46:30.123',
    },
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1 || step === 2 || step === 3;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleCancel = () => {
    console.log('next');
    router.push('/quiz');
  };
  const handleNext = () => {
    console.log('next');
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleNextOne = () => {
    console.log('next');
    const params = {
      jobGroup: jobGroup,
      clubName: clubName,
      studyCycle: studyCycle,
      recommendJobGroups: recommendJobGroups,
      recommendLevels: recommendLevels,
      startAt: today.format('YYYY-MM-DD') + ' 00:00:00.000',
      endAt: todayEnd.format('YYYY-MM-DD') + ' 00:00:00.000',
      description: introductionMessage,
      relatedSkills: ['string'],
      relatedExperiences: ['string'],
      studyWeekCount: 0,
      recruitMemberCount: 0,
      publicYn: 'Y',
      participationCode: '',
    };
    console.log(params);

    if (params.jobGroup.length === 0) {
      alert('등록을 원하는 분야를 선택해주세요.');
      return;
    }

    if (params.clubName === '') {
      alert('클럽 이름을 입력해주세요.');
      return;
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleInputChange = event => {
    setClubName(event.target.value);
  };

  const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, no?: number) => {
    const { name, value } = event.currentTarget;
    setIntroductionMessage(value);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={cx('seminar-container')}>
      {/* <Banner title="커리어멘토스 세미나" subTitle="커멘세미나" /> */}

      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={5} className="tw-font-bold tw-text-3xl tw-text-black">
              성장퀴즈 &gt; 성장퀴즈 클럽 개설하기
            </Grid>
            <Grid item xs={4} className="tw-font-semi tw-text-base tw-text-black">
              나와 쿠루들의 성장을 이끌 퀴즈 클럽을 개설해요!
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                type="button"
                className="tw-text-black tw-border tw-border-indigo-600 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5"
              >
                <Link href="/quiz1" className="nav-link">
                  임시저장 불러오기
                </Link>
              </button>
            </Grid>
          </Grid>
        </div>

        <Stepper activeStep={activeStep} alternativeLabel className="tw-my-10">
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
              labelProps.optional = <Typography variant="caption">Optional</Typography>;
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === 0 && (
          <div>
            <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10 tw-text-center">개설전 약속해요</div>
            <div className={cx('content-area', ' tw-text-center')}>
              모두의 성장을 돕는 좋은 클럽이 되도록 노력해주실거죠?
            </div>
            <div className={cx('content-area', ' tw-text-center')}>
              모두가 퀴즈클럽를 통해 성장할 수 있도록 공정한 관리를 부탁드릴게요!
            </div>
            <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
              <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                <div className="tw-row-span-2">
                  {isStepOptional(activeStep) && (
                    <button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    >
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '다음'}
                    </button>
                  )}
                  <button
                    onClick={handleCancel}
                    className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                  >
                    취소하기
                  </button>
                  <button
                    className="tw-w-[300px] tw-bg-[#2474ED] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    onClick={handleNext}
                  >
                    약속할께요
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeStep === 1 && (
          <article>
            <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">클럽 정보입력</div>
            <div className={cx('content-area')}>
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mb-2">클럽명</div>
              <TextField
                size="small"
                fullWidth
                label={'클럽명을 입력해주세요.'}
                onChange={handleInputChange}
                id="margin-none"
                value={clubName}
                name="clubName"
              />
              <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-5 tw-my-2">클럽 이미지 선택</div>

              <div className="tw-grid tw-grid-flow-col tw-gap-0 tw-content-end">
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    className="tw-object-cover tw-w-[100px] tw-rounded-t-lg tw-h-[100px] md:tw-h-[100px] md:tw-w-[100px] md:tw-rounded-lg"
                    src="/assets/images/banner/Rectangle1.png"
                    alt=""
                  />
                </div>
              </div>

              <div>
                <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-content-start">
                  <div>
                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 직군</div>
                    {jobGroupIdx?.map(item => (
                      <ToggleButton
                        label={item.name}
                        name="jobGroup"
                        value={item.id}
                        key={item.id}
                        variant="small"
                        isActive
                        className={cx('fixed-width')}
                        // register={register}
                        onChange={handleToggle}
                        type="tabRadio"
                        weight="bold"
                        // checked={item.id === jobGroup}
                      />
                    ))}

                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천 레벨</div>
                    {levelGroup?.map(item => (
                      <ToggleButton
                        label={item.name}
                        name="levelGroup"
                        value={item.id}
                        key={item.id}
                        variant="small"
                        isActive
                        className={cx('fixed-width')}
                        // register={register}
                        // onChange={handleToggle}
                        type="tabRadio"
                        weight="bold"
                        // checked={item.id === jobGroup}
                      />
                    ))}
                    <div className="tw-text-sm tw-text-black tw-mt-2 tw-my-0">
                      2레벨 : 상용 서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능.
                    </div>

                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">
                      성장퀴즈 주기 (복수 선택 가능)
                    </div>
                    {dayGroup?.map(item => (
                      <ToggleButton
                        label={item.name}
                        name="levelGroup"
                        value={item.name}
                        key={item.id}
                        variant="small"
                        isActive
                        className={cx('fixed-width')}
                        // register={register}
                        onChange={handleToggleDay}
                        type="multiple"
                        weight="bold"
                        // checked={item.id === jobGroup}
                      />
                    ))}
                  </div>
                  <div>
                    <div>
                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">추천직무</div>
                      {jobGroup1?.map(item => (
                        <ToggleButton
                          label={item.name}
                          name="jobGroup1"
                          value={item.id}
                          key={item.id}
                          variant="small"
                          isActive
                          className={cx('fixed-width')}
                          // register={register}
                          onChange={handleToggleRecommandJobGroup}
                          type="tabRadio"
                          weight="bold"
                          // checked={item.id === jobGroup}
                        />
                      ))}

                      <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-my-2">공개/비공개 설정</div>
                      {privateGroup?.map((item, index) => (
                        <ToggleButton
                          label={item.name}
                          name="privateGroup"
                          value={item.id}
                          key={item.id}
                          variant="small"
                          isActive
                          className={cx('fixed-width')}
                          // register={register}
                          // onChange={handleToggle}
                          // onChange={handleToggleRecommandLevels}
                          type="tabRadio"
                          weight="bold"
                          // checked={item.active}
                        />
                      ))}
                      <TextField size="small" disabled label={'입장코드를 설정해주세요.'} id="margin-none" />
                    </div>
                  </div>
                </div>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">관련스킬</div>
                <TextField size="small" fullWidth label={'관련스킬을 입력해주세요. ex) JAVA'} id="margin-none" />

                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">관련경험</div>
                <TextField size="small" fullWidth label={'관련경험을 입력해주세요. ex) UX'} id="margin-none" />

                <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-content-start">
                  <div>
                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">퀴즈클럽 시작일</div>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        inputFormat="YYYY-MM-DD"
                        value={today}
                        onChange={e => onChangeHandleFromToStartDate(e)}
                        renderInput={params => <TextField {...params} variant="standard" />}
                      />
                    </LocalizationProvider>
                    <div className="tw-text-sm tw-text-black tw-mt-2 tw-my-0">* 스펙업 주기는 기본 12주 입니다.</div>
                  </div>
                  <div>
                    <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">클럽 모집 마감일</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        inputFormat="YYYY-MM-DD"
                        value={todayEnd}
                        onChange={e => onChangeHandleFromToEndDate(e)}
                        renderInput={params => <TextField {...params} variant="standard" />}
                      />
                    </LocalizationProvider>
                    <div className="tw-text-sm tw-text-black tw-mt-2 tw-my-0">
                      *스펙업 시작일보다 이른 날짜만 설정이 가능합니다.
                    </div>
                  </div>
                </div>
                <div className="tw-font-semibold tw-text-sm tw-text-black tw-mt-10 tw-mb-2">성장퀴즈 클럽 소개</div>
                <TextField
                  fullWidth
                  id="margin-none"
                  multiline
                  rows={6}
                  onChange={onMessageChange}
                  value={introductionMessage}
                  defaultValue="클럽 소개 내용을 입력해주세요."
                />
              </div>
            </div>
            <div className="tw-container tw-py-10 tw-px-10 tw-mx-0 tw-min-w-full tw-flex tw-flex-col tw-items-center">
              <div className="tw-grid tw-grid-rows-3 tw-grid-flow-col tw-gap-4">
                <div className="tw-row-span-2">
                  {/* {isStepOptional(activeStep) && (
                    <button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    >
                      {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '다음'}
                    </button>
                  )} */}
                  <button className="tw-w-[300px] btn-outline-secondary tw-outline-blue-500 tw-bg-white tw-mr-5 tw-text-black tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded">
                    임시 저장하기
                  </button>
                  <button
                    className="tw-w-[300px] tw-bg-[#2474ED] tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-mt-3 tw-rounded"
                    onClick={handleNextOne}
                  >
                    {activeStep === steps.length - 1 ? '성장퀴즈 클럽 개설하기 >' : '다음'}
                  </button>
                </div>
              </div>
            </div>
          </article>
        )}

        {activeStep === 2 && (
          <>
            <article>
              <div className="tw-font-bold tw-text-xl tw-text-black tw-my-10">퀴즈 등록하기</div>
              <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
                <button
                  type="button"
                  onClick={() => handleAddClick()}
                  className="tw-text-white tw-bg-blue-500 hover:tw-bg-blue-800 tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
                >
                  퀴즈 등록하기 +
                </button>
              </Grid>
            </article>
          </>
        )}
      </div>
      <MentorsModal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)}>
        <div className={cx('mentoring-register-container__card-nodes')}>
          <div>asdfsdafasda</div>
          {/* {jobs?.map((item, index) => {
            return (
              <NodeCard
                index={index}
                key={`jobs-${index}`}
                title={`레벨 ${item.level}`}
                content={item.description}
                jobCode={item.jobGroup}
                onClickNode={handleNodeCard}
                chapterNo={chapterNo}
              />
            );
          })} */}
        </div>
      </MentorsModal>
    </div>
  );
}

export default QuizOpenTemplate;
