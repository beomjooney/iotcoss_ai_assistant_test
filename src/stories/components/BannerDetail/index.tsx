import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Image from 'next/image';
import { Typography } from '../index';
import { Desktop } from 'src/hooks/mediaQuery';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

// ...

const item = {
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
};

export interface BannerProps {
  /** 배경 이미지 */
  imageName?: string;
  /** 제목 */
  title: string;
  /** 클래스 */
  className?: string;
  subTitle?: string;
}

const cx = classNames.bind(styles);

// const Banner = ({ imageName = 'top_banner_seminar.jpg', title, subTitle, className }: BannerProps) => {
const BannerDetail = ({ imageName = 'seminar_bg.png', title, subTitle, className }: BannerProps) => {
  return (
    <div className={cx('content-area', className, 'tw-bg-[#FFFAF1]')}>
      <div className="container tw-p-4 tw-leading-normal tw-text-black tw-font-bold tw-text-xl tw-pt-10 tw-pb-10">
        {title} {'>'} {subTitle}
      </div>
      <div className={cx('banner-container__wrap', ' tw-pb-20')}>
        {/*todo url 경로에 따라 자동 셋팅 구현*/}
        <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow md:tw-flex-row md:tw-max-w-[1100px] hover:tw-bg-gray-100 dark:tw-border-gray-700 dark:tw-bg-gray-800 dark:hover:tw-bg-gray-700">
          <img
            className="tw-object-cover tw-w-[320px] tw-rounded-t-lg tw-h-[320px] md:tw-h-[320px] md:tw-w-[320px] md:tw-rounded-none md:tw-rounded-l-lg"
            src="/assets/images/banner/Rectangle1.png"
            alt=""
          />
          <div className="tw-flex tw-flex-col tw-justify-between tw-p-4 tw-leading-normal">
            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={8} className="tw-font-bold tw-text-3xl tw-text-black">
                <div className="tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                  <span className="tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-0.5 tw-rounded tw-dark:bg-blue-900 tw-dark:text-blue-300">
                    개발
                  </span>
                  <span className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-0.5 tw-rounded tw-dark:bg-gray-700 tw-dark:text-gray-300">
                    레벨1
                  </span>
                  <span className="tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-0.5 tw-rounded tw-dark:bg-red-900 tw-dark:text-red-300">
                    백엔드개발자
                  </span>
                </div>
              </Grid>
              <Grid item xs={4} justifyContent="center" alignItems="center" className="tw-flex">
                모집마감일 : {item.date}
                <div>
                  <IconButton aria-label="Bookmark">
                    <BookmarkBorderIcon />
                  </IconButton>
                </div>
              </Grid>
            </Grid>

            <div className="tw-mb-3 tw-text-sm tw-font-semibold tw-text-gray-500 dark:tw-text-gray-400"></div>
            <h6 className="tw-mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-white">
              {item.title}
            </h6>
            <p className="tw-line-clamp-2 tw-mb-3 tw-font-normal tw-text-gray-700 dark:tw-text-gray-400">
              Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
            </p>

            <div className="tw-text-base tw-font-bold tw-text-black dark:tw-text-gray-400">
              성장퀴즈 주수 : 12주 | 학습 36회 (2023.06.01~2023.08.31)
            </div>
            <div className="tw-text-base tw-font-bold tw-text-black dark:tw-text-gray-400">
              성장퀴즈 주기 : 월, 수, 금
            </div>
            <div className="tw-mb-3 tw-text-base tw-font-bold tw-text-black dark:tw-text-gray-400">모집인원 : 00명</div>
            <div className="tw-mb-3 tw-text-base tw-font-semibold tw-text-gray-400 dark:tw-text-gray-400">
              #프론트엔드 #JAVA #HTML
            </div>

            <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
              <Grid item xs={8} className="tw-font-bold tw-text-3xl tw-text-black">
                <div className="tw-flex tw-items-center tw-space-x-4">
                  <img className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full" src={item?.author?.avatar} alt="" />
                  <div className="tw-text-sm tw-font-semibold tw-text-black dark:tw-text-white">
                    <div>{item?.author?.displayName}</div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4} justifyContent="flex-end" className="tw-flex">
                <button
                  type="button"
                  className="tw-text-white tw-bg-blue-500 hover:tw-bg-blue-800 tw-focus:ring-4 focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5  dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800"
                >
                  친구초대
                </button>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDetail;
