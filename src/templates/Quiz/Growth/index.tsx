import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import BannerDetail from 'src/stories/components/BannerDetail';
import { jobColorKey } from 'src/config/colors';
import Chip from 'src/stories/components/Chip';
import { useStore } from 'src/store';
import { Button, Typography, Profile, Modal, ArticleCard } from 'src/stories/components';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useMySeminarList, useSeminarDetail, useSeminarList } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { ArticleEnum } from 'src/config/types';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import {
  useEncoreSeminar,
  useOpenSeminar,
  useParticipantCancelSeminar,
  useParticipantSeminar,
} from 'src/services/seminars/seminars.mutations';
import { useSessionStore } from 'src/store/session';
import Grid from '@mui/material/Grid';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import router, { useRouter } from 'next/router';
import { useQuizGrowthDetail } from 'src/services/quiz/quiz.queries';
import Divider from '@mui/material/Divider';

const cx = classNames.bind(styles);
export interface QuizGrowthTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizGrowthTemplate({ id }: QuizGrowthTemplateProps) {
  const { user } = useStore();
  const [value, setValue] = React.useState(0);
  const [isBookmark, setIsBookmark] = useState(true);
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState<boolean>(false);
  const [myParticipation, setMyParticipation] = useState(null);
  const [restTime, setRestTime] = useState(0);
  const [clubStatus, setClubStatus] = useState('0000');
  const [clubMemberStatus, setClubMemberStatus] = useState('0001');
  const [applicationButton, setApplicationButton] = useState<ReactNode>(null);
  const { memberId, logged } = useSessionStore.getState();

  // setClubMemberStatus(data?.clubMemberStatus);
  const { isFetched: isParticipantListFetched, data } = useQuizGrowthDetail(id, data => {
    setContents(data);
  });

  //console.log('detail : ', data);
  const { mutate: onParticipant } = useParticipantSeminar();
  const { mutate: onCancelParticipant } = useParticipantCancelSeminar();
  const { mutate: onEncoreSeminar } = useEncoreSeminar();

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    className?: any;
  }

  const router = useRouter();
  //console.log(router.query);

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <div className="tw-py-[60px] max-lg:tw-py-[50px]">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={12} sm={2} className="tw-font-bold tw-text-3xl tw-text-black max-lg:!tw-text-2xl">
              퀴즈클럽
            </Grid>
            <Grid
              item
              xs={12}
              sm={7}
              className="max-lg:tw-p-y-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-base"
            >
              퀴즈클럽 풀고 천하무적 커리어를 만들어요!
            </Grid>
            <Grid item xs={12} sm={3} justifyContent="flex-end" className="tw-flex"></Grid>
          </Grid>
        </div>
        <Divider className="tw-mt-8 tw-border tw-bg-['#efefef']" />
        <div className="tw-text-center tw-pt-40 max-lg:tw-pt-10">
          <div className="tw-font-bold tw-text-2xl tw-text-black">오늘퀴즈로 이만큼이나 성장하셨네요!</div>
          <div className="progress-title max-lg:tw-mx-[50px] tw-mx-[300px] tw-mt-10">
            <h6>
              퀴즈 진행률
              <span className="float-right">
                <span className="progress-number">{parseInt(contents?.progressPercentage)}%</span>
              </span>
            </h6>
          </div>
          <div className="mt-3 tw-mx-[300px] max-lg:tw-mx-[50px] tw-mt-20">
            <div className="progress-item">
              <div className="progress p-0">
                <span style={{ width: `${parseInt(contents?.progressPercentage)}%` }}>
                  <span className="progress-line"></span>
                </span>
              </div>
            </div>
            <div className="tw-grid tw-grid-cols-8 tw-gap-4 tw-mt-20 tw-text-sm tw-font-bold tw-text-black">
              <div className="tw-col-span-4 border tw-rounded-base tw-h-14 tw-flex tw-items-center tw-justify-center">
                <div className="tw-p-5">푼 퀴즈 {contents?.completedQuizCount}</div>
              </div>
              <div className="tw-col-span-4 border tw-rounded-base tw-h-14 tw-flex tw-items-center tw-justify-center">
                <div className="tw-p-5">총 퀴즈 {contents?.totalQuizCount}</div>
              </div>
            </div>
            <div className="tw-grid tw-grid-cols-8 tw-gap-4 tw-mt-5 tw-text-sm tw-font-bold tw-text-black">
              <div className="tw-col-span-4 border tw-rounded-base tw-h-14  tw-flex tw-items-center tw-justify-center">
                획득 경험치 +{contents?.increaseExperiencePoints}
              </div>
              <div className="tw-col-span-4 border tw-rounded-base tw-h-14  tw-flex tw-items-center tw-justify-center">
                획득 배지 +{contents?.achievedBadgeCount}
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push('/quiz/answers/' + `${router.query.qid}`)}
            // location.href = '/quiz/answers/' + `${router.query.qid}`)}
            className="tw-mt-20 tw-bg-blue-500 tw-text-white tw-text-base tw-font-bold tw-mr-2 tw-px-16 tw-py-3 tw-rounded"
          >
            퀴즈 답변 확인하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizGrowthTemplate;
