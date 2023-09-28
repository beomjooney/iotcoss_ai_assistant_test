import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import BannerDetail from 'src/stories/components/BannerDetail';
import { jobColorKey } from 'src/config/colors';
import Chip from 'src/stories/components/Chip';
import { useStore } from 'src/store';
import { Button, Typography, Profile, Modal, ArticleCard, MentorsModal } from 'src/stories/components';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { paramProps, useClubQuizManage } from 'src/services/seminars/seminars.queries';
import { RecommendContent } from 'src/models/recommend';
import { useSessionStore } from 'src/store/session';
import Grid from '@mui/material/Grid';

/** drag list */
import ReactDragList from 'react-drag-list';
import { useQuizOrder } from 'src/services/quiz/quiz.mutations';

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
  const [quizList, setQuizList] = useState<RecommendContent[]>([]);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState<boolean>(false);
  const [totalElements, setTotalElements] = useState(0);
  const { memberId, logged } = useSessionStore.getState();
  const [itemList, setItemList] = useState<any[]>([]);

  const { data, refetch } = useClubQuizManage(id, data => {
    setContents(data || []);
    setQuizList(data?.quizPage?.contents || []);
    setTotalElements(data?.quizPage?.totalElements);
  });

  /** quiz */
  const [page, setPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page });

  /**save profile */
  const { mutate: onQuizOrder } = useQuizOrder();

  // 드래그해서 변경된 리스트를 브라우저상에 나타나게 만드는것
  const handleUpdate = (evt: any, updated: any) => {
    console.log(evt); // tslint:disable-line
    console.log(updated); // tslint:disable-line
    setItemList([...updated]);
  };

  const handleAddClick = () => {
    console.log(itemList);
    // Transforming the data into an array of objects with "clubQuizSequence" and "order" properties
    const transformedData = {
      clubSequence: contents?.clubSequence, // Add the "clubSequence" property with a value of 2
      clubQuizOrders: itemList.map(item => ({
        clubQuizSequence: item.clubQuizSequence,
        order: item.order,
      })),
    };
    console.log(transformedData);
    onQuizOrder(transformedData);
  };

  const dragList = (item: any, index: any) => (
    <Grid key={'drag-' + index} container direction="row" justifyContent="left" alignItems="center" rowSpacing={3}>
      <Grid item xs={1}>
        <div className="tw-flex-auto tw-text-center">
          <button
            type="button"
            // onClick={() => handleDeleteQuiz(item.quizSequence)}
            className="tw-text-blue-700 border tw-border-blue-700 tw-font-medium tw-rounded-lg tw-text-sm tw-p-2.5 tw-text-center tw-inline-flex tw-items-center tw-mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="tw-w-6 tw-h-6 tw-text-black"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>

            <span className="sr-only">Icon description</span>
          </button>
        </div>
      </Grid>
      <Grid item xs={11}>
        <div className="tw-flex tw-items-center tw-p-4 tw-border border mb-3 mt-3 rounded  tw-h-[60px]">
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
  return (
    <div className={cx('seminar-detail-container')}>
      <div className={cx('container')}>
        <div className="tw-py-5 tw-mb-16">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={4} className="tw-font-bold tw-text-3xl tw-text-black">
              내가 만든 클럽 &gt; 퀴즈관리
            </Grid>
            <Grid item xs={5} className="tw-font-semi tw-text-base tw-text-black">
              나의 퀴즈클럽 클럽 페이지에 관련 간단한 설명
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              <button
                type="button"
                onClick={handleAddClick}
                className="tw-text-white tw-bg-blue-500 tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5 "
              >
                성장퀴즈 추가하기
              </button>
            </Grid>
          </Grid>
        </div>
        <div className="tw-flex tw-items-center tw-mb-6">
          <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={0}>
            <Grid item xs={2} className="tw-font-bold tw-text-xl tw-text-black">
              <div className="tw-text-base tw-font-right tw-mr-5 tw-text-black">
                총 {totalElements}개 중 {totalElements}개 등록
              </div>
            </Grid>

            <Grid item xs={7} className="tw-font-bold tw-text-xl tw-text-black ">
              <div className="tw-p-0 tw-text-sm tw-font-normal tw-text-gray-500 ">
                {contents?.recommendJobGroupNames?.map((name, i) => (
                  <span
                    key={i}
                    className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-blue-100 tw-text-sm tw-font-light tw-text-blue-600"
                  >
                    {name}
                  </span>
                ))}
                <span className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-red-100 tw-text-sm tw-font-light tw-text-red-600">
                  {contents?.recommendLevels?.sort().join(',')}레벨
                </span>
                {contents?.recommendJobNames?.map((name, i) => (
                  <span
                    key={i}
                    className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 tw-bg-gray-100 tw-text-sm tw-font-light tw-text-gray-600"
                  >
                    {name}
                  </span>
                ))}
                {contents?.hashTags?.map((name, i) => (
                  <span
                    key={i}
                    className="tw-inline-flex tw-rounded tw-items-center tw-m-1 tw-px-3 tw-py-0.5 border tw-text-sm tw-font-light tw-text-gray-700"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </Grid>
            <Grid item xs={3} justifyContent="flex-end" className="tw-flex">
              {contents?.isBeforeOpening ? (
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="tw-text-black tw-bg-white border tw-font-medium tw-rounded-md tw-text-sm tw-px-5 tw-py-2.5 "
                >
                  퀴즈 순서변경
                </button>
              ) : (
                <div></div>
              )}
            </Grid>
          </Grid>
        </div>
        <Grid container direction="row" justifyContent="left" alignItems="center">
          <Grid item xs={1}>
            {quizList.map((item, index) => {
              return (
                <Grid key={index} container direction="row" justifyContent="left" alignItems="center" rowSpacing={3}>
                  <Grid item xs={10}>
                    <div className="tw-flex-auto tw-text-center tw-text-black tw-font-bold">Q{index + 1}.</div>
                    <div className="tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold">
                      {item?.weekNumber} 주차 ({item?.studyDay})
                    </div>
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={1} className="">
                    <div className=" tw-p-4 tw-border mb-3 mt-3 tw-h-[60px] "></div>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
          <Grid item xs={11}>
            {contents?.isBeforeOpening ? (
              <div>
                <ReactDragList
                  dataSource={quizList}
                  rowKey="content"
                  row={dragList}
                  handles={false}
                  className="simple-drag"
                  rowClassName="simple-drag-row"
                  onUpdate={handleUpdate}
                />
              </div>
            ) : (
              <div>
                {quizList.map((item, index) => {
                  return (
                    <Grid
                      key={'drag-' + index}
                      container
                      direction="row"
                      justifyContent="left"
                      alignItems="center"
                      rowSpacing={3}
                    >
                      <Grid item xs={1}>
                        <div className="tw-flex-auto tw-text-center">
                          {/* <button
                            type="button"
                            // onClick={() => handleDeleteQuiz(item.quizSequence)}
                            className="tw-text-blue-700 border tw-border-blue-700 tw-font-medium tw-rounded-lg tw-text-sm tw-p-2.5 tw-text-center tw-inline-flex tw-items-center tw-mr-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="tw-w-6 tw-h-6 tw-text-black"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                              />
                            </svg>

                            <span className="sr-only">Icon description</span>
                          </button> */}
                        </div>
                      </Grid>
                      <Grid item xs={11}>
                        <div className="tw-flex tw-items-center tw-p-4 tw-border border mb-3 mt-3 rounded  tw-h-[60px]">
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
                })}
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default QuizManageTemplate;
