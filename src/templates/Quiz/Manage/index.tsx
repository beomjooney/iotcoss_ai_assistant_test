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
import {
  useClubQuizManage,
  useMySeminarList,
  useSeminarDetail,
  useSeminarList,
} from 'src/services/seminars/seminars.queries';
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
import { Item } from '@shopify/polaris/build/ts/src/components/ActionList/components';

const cx = classNames.bind(styles);
export interface QuizManageTemplateProps {
  /** 세미나 아이디 */
  id?: any;
}

export function QuizManageTemplate({ id }: QuizManageTemplateProps) {
  const { user } = useStore();
  const [value, setValue] = React.useState(0);
  const [isBookmark, setIsBookmark] = useState(true);
  const [contents, setContents] = useState<RecommendContent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState<boolean>(false);
  const [myParticipation, setMyParticipation] = useState(null);
  const [restTime, setRestTime] = useState(0);
  const [clubStatus, setClubStatus] = useState('0000');
  const [applicationButton, setApplicationButton] = useState<ReactNode>(null);
  const { memberId, logged } = useSessionStore.getState();

  // const { isFetched: isContentFetched } = useSeminarList({ size: 2, excludeSeminarIds: id }, data => {
  //   setContents(data.data || []);
  // });
  // const { isFetched: isParticipantListFetched } = useMySeminarList(
  //   { enabled: logged && user?.roles?.indexOf('ROLE_USER') >= 0 && user?.roles?.indexOf('ROLE_ADMIN') < 0 },
  //   data => {
  //     setMyParticipation(data.find(item => item.seminarId === id)?.myParticipant);
  //   },
  // );

  const { data, refetch } = useClubQuizManage(id, data => {
    // setClubStatus(data?.clubStatus);
    // console.log(data);
    setContents(data?.contents || []);
    // setRestTime(moment(data?.seminarRegistrationEndDate, 'YYYY-MM-DD HH:mm:ss').diff(moment(), 'hours'));
  });

  console.log('detail : ', data);
  const { mutate: onParticipant } = useParticipantSeminar();
  const { mutate: onCancelParticipant } = useParticipantCancelSeminar();
  const { mutate: onEncoreSeminar } = useEncoreSeminar();

  let tabPannelRefs = [];

  const onOpenSeminarFnc = () => {
    if (logged) {
      if (confirm('세미나 앵콜 신청을 하시겠습니까?')) {
        onEncoreSeminar({
          seminarId: id,
          memberId: memberId,
          mentorId: data?.seminarLecturer?.memberId,
        });
      }
    } else {
      alert('로그인 세미나 앵콜 신청을 할 수 있습니다.');
    }
  };

  // useEffect(() => {}, [user, logged, restTime, myParticipation]);
  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <div className="tw-py-5 tw-mb-16">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={5} className="tw-font-bold tw-text-3xl tw-text-black">
              내가 만든 클럽 &gt; 퀴즈관리
            </Grid>
            <Grid item xs={4} className="tw-font-semi tw-text-base tw-text-black">
              나의 퀴즈클럽 클럽 페이지에 관련 간단한 설명
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              {/* <button
            type="button"
            className="tw-text-black tw-border tw-border-indigo-600 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5"
          >
            <Link href="/quiz1" className="nav-link">
              임시저장 불러오기
            </Link>
          </button> */}
            </Grid>
          </Grid>
        </div>
        <div className="tw-text-sm tw-font-semibold">총 {contents.length} 개 등록</div>

        {contents.map((item, index) => {
          return (
            <Grid key={index} container direction="row" justifyContent="left" alignItems="center" rowSpacing={3}>
              <Grid item xs={1}>
                <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">Q{index + 1}.</div>
                <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                  {item?.weekNumber} 주차 ({item?.studyDay})
                </div>
              </Grid>
              <Grid item xs={1}>
                <div className="tw-flex-auto tw-text-center">
                  <button
                    type="button"
                    // onClick={() => handleDeleteQuiz(item.quizSequence)}
                    className="tw-text-blue-700 border tw-border-blue-700 tw-font-medium tw-rounded-lg tw-text-sm tw-p-2.5 tw-text-center tw-inline-flex tw-items-center tw-mr-2"
                  >
                    <svg
                      className="tw-w-4 tw-h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="2 2 12 12"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                    <span className="sr-only">Icon description</span>
                  </button>
                </div>
              </Grid>
              <Grid item xs={10}>
                <div className="tw-flex tw-items-center tw-p-4 tw-border border mb-3 mt-3 rounded">
                  <div className="tw-flex-auto">
                    <div className="tw-font-medium tw-text-black">{item?.content}</div>
                  </div>

                  <div className="">
                    {item?.isRepresentative === true && (
                      // <div onClick={() => handleClickQuiz(item?.quizSequence, item?.isRepresentative)}>
                      <button
                        type="button"
                        data-tooltip-target="tooltip-default"
                        className="tw-bg-green-100 tw-text-green-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                      >
                        대표
                      </button>
                      // </div>
                    )}
                    {item?.isRepresentative === false && (
                      // <div onClick={() => handleClickQuiz(item?.quizSequence, item?.isRepresentative)}>
                      <button
                        type="button"
                        data-tooltip-target="tooltip-default"
                        className="tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-3 tw-py-1 tw-rounded"
                      >
                        대표
                      </button>
                      // </div>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          );
          // <ArticleCard uiType={item.contentsType} content={item} key={i} className={cx('container__item')} />
        })}
      </div>
      <div className={cx('container')}>{/*바로 밑에 자식만 sticky 적용됨*/}</div>
    </div>
  );
}

export default QuizManageTemplate;
