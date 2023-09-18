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
import router from 'next/router';
import { useQuizGrowthDetail } from 'src/services/quiz/quiz.queries';

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
    console.log(data?.description);
  });

  console.log('detail : ', data);
  const { mutate: onParticipant } = useParticipantSeminar();
  const { mutate: onCancelParticipant } = useParticipantCancelSeminar();
  const { mutate: onEncoreSeminar } = useEncoreSeminar();

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    className?: any;
  }

  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <div className="tw-py-5">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-3xl tw-text-black max-lg:!tw-text-base">
              퀴즈클럽
            </Grid>
            <Grid item xs={7} className="max-lg:tw-p-2 tw-font-semi tw-text-base tw-text-black  max-lg:!tw-text-sm">
              퀴즈클럽 풀고 천하무적 커리어를 만들어요!
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex"></Grid>
          </Grid>
        </div>
        <div className="tw-text-center tw-p-54">ㅇㅇ</div>
      </div>
    </div>
  );
}

export default QuizGrowthTemplate;
