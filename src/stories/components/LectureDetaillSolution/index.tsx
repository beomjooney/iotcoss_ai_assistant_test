// QuizClubDetailInfo.jsx
import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { TextField } from '@mui/material';

/** import pagenation */
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useClubJoin } from 'src/services/community/community.mutations';
import { getButtonText, getClubStatusMessage, getClubAboutStatus } from 'src/utils/clubStatus';

/**icon */
import { useSaveLike, useDeleteLike } from 'src/services/community/community.mutations';
import router from 'next/router';
import { Button, Typography, Profile, Modal, ArticleCard } from 'src/stories/components';

// 챗봇
import ChatbotModal from 'src/stories/components/ChatBot';
import { useSessionStore } from '../../../../src/store/session';

const cx = classNames.bind(styles);

//comment

const LectureDetaillSolution = ({
  totalElements,
  contents,
  quizList,
  border,
  page,
  totalPage,
  handlePageChange,
  study,
  selectedImageBanner,
  selectedImage,
  refetchClubAbout,
}) => {
  console.log('contents', contents);
  console.log('study', study);
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  let [isLiked, setIsLiked] = useState(false);
  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();
  const [participationCode, setParticipationCode] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { roles, menu, token, logged } = useSessionStore.getState();

  const [isClient, setIsClient] = useState(false); // 클라이언트 사이드에서만 렌어링하도록 상태 추가
  useEffect(() => {
    setIsClient(true); // 클라이언트 사이드에서 상태를 true로 설정
    setIsLiked(contents?.isFavorite);
  }, []);

  const [expandedItems, setExpandedItems] = useState(() => Array(quizList?.length || 0).fill(false));
  const [expandedQuizzData, setExpandedQuizzData] = useState(
    () => quizList?.map(item => Array(item?.makeupQuizzes?.length || 0).fill(false)) || [],
  );

  const { mutate: onClubJoin, isSuccess: clubJoinSucces } = useClubJoin();

  useEffect(() => {
    if (clubJoinSucces) {
      refetchClubAbout();
    }
  }, [clubJoinSucces]);

  const onChangeLike = function (postNo: number) {
    event.preventDefault();
    setIsLiked(!isLiked);
    if (isLiked) {
      onDeleteLike(postNo);
    } else {
      onSaveLike(postNo);
    }
  };

  const handlerClubJoin = (clubSequence: number, isPublic: boolean) => {
    console.log('test');
    setIsModalOpen(true);
    // onClubJoin({
    //   clubSequence: clubSequence,
    //   participationCode: '',
    // });
  };

  return (
    <div className={`tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white ${borderStyle}`}>
      <div className="tw-pt-[35px]">
        <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden border-t-0 border-r-0 border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">강의클럽</p>
            <svg
              width={17}
              height={16}
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-[15.75px] tw-h-[15.75px] tw-relative"
              preserveAspectRatio="none"
            >
              <path
                d="M6.96925 11.25L10.3438 7.8755L6.96925 4.50101L6.40651 5.06336L9.21905 7.8755L6.40651 10.6877L6.96925 11.25Z"
                fill="#313B49"
              />
            </svg>
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">
              강의 상세보기
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              강의 상세보기
            </p>
          </div>
        </div>
        <div
          style={{ backgroundImage: `url(${contents?.backgroundImageUrl})` }}
          className="tw-rounded-lg tw-bg-cover tw-bg-center tw-w-full tw-overflow-hidden tw-px-14 tw-pt-[40px] tw-py-5"
        >
          <Grid container direction="row" justifyContent="space-between" alignItems="start" rowSpacing={0}>
            <Grid item xs={8}>
              <div className="tw-gap-3  tw-flex tw-items-center tw-flex-wrap tw-text-base tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                  <p className="tw-text-[12.25px] tw-text-[#235a8d]">
                    {contents?.jobGroups && contents.jobGroups.length > 0 ? contents.jobGroups[0].name : 'N/A'}
                  </p>
                </div>
                {contents?.jobs?.length > 0 &&
                  contents.jobs.map((job, index) => (
                    <div key={index} className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                      <p className="tw-text-[12.25px] tw-text-[#b83333]">{job.name}</p>
                    </div>
                  ))}

                {contents?.jobLevels?.length > 0 &&
                  contents.jobLevels.map((jobLevel, index) => (
                    <div key={index} className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-2 tw-py-[1px]">
                      <p className="tw-text-[12.25px] tw-text-[#313b49]">{jobLevel.name || 'N/A'}</p>
                    </div>
                  ))}
                <button
                  className=""
                  onClick={() => {
                    onChangeLike(contents?.clubSequence);
                  }}
                >
                  {isLiked ? <StarIcon color="error" /> : <StarBorderIcon color="disabled" />}
                </button>
              </div>
              <div className="tw-text-black tw-text-2xl tw-font-bold tw-py-3">{contents?.clubName}</div>
            </Grid>
            <Grid item xs={4} container justifyContent="flex-end">
              <div className="tw-z-0">
                <img
                  className="tw-w-40 tw-h-40 tw-rounded-lg "
                  src={contents?.clubImageUrl || '/assets/images/banner/Rectangle_190.png'}
                />
                <div className="tw-mt-5">
                  {contents?.clubAboutStatus === '0300' ? (
                    <button
                      onClick={() => handlerClubJoin(contents?.clubSequence, contents?.isPublic)}
                      className="tw-cursor-pointer tw-w-40 tw-text-[12.25px] tw-font-bold tw-text-center tw-text-white tw-bg-blue-600 tw-px-4 tw-py-4 tw-rounded"
                    >
                      참여하기
                    </button>
                  ) : (
                    <>
                      <button className="tw-w-40 tw-text-[12.25px] tw-bg-blue-600 tw-font-bold tw-text-center tw-text-white tw-bg-primary tw-px-4 tw-py-4 tw-rounded">
                        {getClubAboutStatus(contents?.clubAboutStatus)}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className="tw-pointer-events-none tw-px-[50px] tw-absolute tw-top-[300px] tw-left-0 tw-right-0 tw-bottom-0 tw-rounded-[8.75px] tw-py-[40px]">
          <div className="tw-flex tw-items-end tw-gap-[16px]">
            <img
              className="tw-w-40 tw-h-40 tw-rounded-full"
              src={contents?.leader?.profileImageUrl || '/assets/images/account/default_profile_image.png'}
            />
            <div className="tw-flex tw-items-center">
              <div className="tw-flex tw-text-sm tw-text-black border tw-py-1 tw-px-2  tw-mr-5 tw-rounded-lg">
                교수자
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-[14px]  tw-gap-3">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21.875px] tw-font-bold tw-text-left tw-text-black">
                  {contents?.leader?.nickname || 'N/A'}
                </p>
              </div>
              {/* <p className="tw-text-[12.25px] tw-text-[#6a7380]">{user?.position}</p> */}
            </div>
          </div>
        </div>

        {/* Content Section */}
        {/* {activeTab === 'myQuiz' && ( */}
        <div className="tw-mt-[130px] tw-flex tw-flex-col tw-space-y-4 tw-rounded-lg tw-py-4 tw-overflow-hidden">
          <div className="tw-rounded-[8.75px] tw-mb-[30px] border">
            <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
              <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
                <img
                  src="/assets/images/quiz/Calendar_perspective_matte.png"
                  className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
                />
              </div>
              <div className="tw-col-start-2 tw-col-end-12">
                <div className="tw-flex tw-flex-col">
                  <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">강의 일정</p>
                </div>
                <div className="tw-flex">
                  <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">강의기간 : </p>
                  <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2">
                    {contents?.startAt?.split('T')[0]} ~ {contents?.endAt?.split('T')[0]}
                  </p>
                </div>
                <div className="tw-flex">
                  <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">강의현황 : </p>
                  <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">
                    {getButtonText(contents?.clubStatus)}
                  </p>
                </div>
                <div className="tw-flex">
                  <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">학습 주제 : </p>
                  <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">{contents?.studySubject}</p>
                </div>
                <div className="tw-flex">
                  <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">학습 키워드 : </p>
                  <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">
                    {contents?.studyKeywords?.toString()}
                  </p>
                </div>
                <div className="tw-flex">
                  <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">학습 스킬 : </p>
                  <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">{contents?.skills?.toString()}</p>
                </div>
                <div className="tw-flex">
                  <p className="tw-text-sm tw-font-bold tw-text-left tw-text-black">참여 인원 : </p>
                  <p className="tw-text-sm tw-text-left tw-text-black tw-pl-2 ">
                    {contents?.recruitedMemberCount || 0} / {contents?.recruitMemberCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('content-wrap')}>
            <Grid container direction="row" alignItems="center" rowSpacing={0}>
              <Grid
                item
                container
                justifyContent="flex-start"
                xs={6}
                sm={10}
                className="tw-text-xl tw-text-black tw-font-bold"
              >
                강의 목록 ({study?.length || 0})
              </Grid>
              <Grid container justifyContent="flex-end" item xs={6} sm={2} style={{ textAlign: 'right' }}>
                {/* <Pagination
                  count={totalPage}
                  size="small"
                  siblingCount={0}
                  page={page}
                  renderItem={item => (
                    <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                  )}
                  onChange={handlePageChange}
                /> */}
              </Grid>
            </Grid>
            <Divider className="tw-py-3 tw-mb-3" />
            {study?.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <Grid
                    className="tw-pt-10"
                    key={index}
                    container
                    direction="row"
                    justifyContent="left"
                    alignItems="center"
                    rowSpacing={3}
                  >
                    <>
                      <Grid item xs={12} sm={1} style={{ paddingTop: 10 }}>
                        <div
                          className={`tw-flex-auto tw-text-center  tw-font-bold ${
                            item?.isCompleted ? 'tw-text-black' : 'tw-text-gray-300 tw-font-normal'
                          }`}
                        >
                          {item?.studyOrder}회차
                        </div>
                        <div
                          className={`tw-flex-auto tw-text-center tw-text-sm tw-text-black  tw-font-bold ${
                            item?.isCompleted ? 'tw-text-black' : 'tw-text-gray-300 tw-font-normal'
                          }`}
                        >
                          {item?.studyDate.split('-').slice(1).join('-')} ({item?.dayOfWeek})
                        </div>
                      </Grid>

                      <Grid item xs={12} sm={11}>
                        <div className="tw-rounded-xl">
                          <div
                            className={`tw-py-7 tw-flex tw-items-center tw-px-4 max-lg:tw-p-3 tw-py-1 tw-rounded-lg ${
                              item?.isCompleted ? 'tw-bg-[#F6F7FB] ' : 'tw-bg-white border  tw-opacity-50'
                            }`}
                          >
                            <div className="tw-flex tw-item-center  tw-px-5 tw-w-9/12 tw-gap-4">
                              <div className="tw-flex tw-font-medium tw-text-black">{item?.clubStudyName}</div>
                              {item?.clubStudyType === '0100' ? (
                                <div className="tw-text-xs tw-text-center tw-px-2 tw-py-1 tw-text-white tw-bg-blue-500 tw-rounded-md">
                                  온라인
                                </div>
                              ) : (
                                <div className="border border-primary tw-text-xs tw-text-center tw-px-2 tw-py-1 tw-text-blue-500 tw-bg-white tw-rounded-md">
                                  오프라인
                                </div>
                              )}
                            </div>
                            <div className="tw-flex-auto">
                              <div className="tw-flex tw-justify-end tw-items-center tw-relative tw-gap-2 tw-px-2 tw-py-1 tw-rounded">
                                {item?.isCompleted ? (
                                  <button
                                    onClick={() => {
                                      // router.push('/lecture-list/' + `${contents?.clubSequence}`);
                                      router.push(
                                        {
                                          pathname: `/lecture-list/${contents?.clubSequence}`,
                                          query: {
                                            clubStudySequence: item?.clubStudySequence,
                                          },
                                        },
                                        `/lecture-list/${contents?.clubSequence}?clubStudySequence=${item?.clubStudySequence}`,
                                      );
                                    }}
                                    className="tw-bg-black tw-text-xs tw-px-2 tw-py-1 tw-text-white tw-rounded-md  tw-font-bold tw-text-right"
                                  >
                                    Q&A 보기
                                  </button>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </>
                  </Grid>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        {isClient && !modalIsOpen && logged && menu.use_lecture_club && (
          <div>
            <div
              className="tw-fixed tw-bottom-0 tw-right-0 tw-w-12 md:tw-w-16 tw-h-12 md:tw-h-16 tw-mr-4 md:tw-mr-10 tw-mb-4 md:tw-mb-8 tw-cursor-pointer tw-z-10"
              onClick={() => setModalIsOpen(true)}
            >
              <img src="/assets/images/main/chatbot.png" />
            </div>
          </div>
        )}
        {isClient && <ChatbotModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} token={token} />}
      </div>
      <Modal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} title="" maxWidth="900px">
        <div className={cx('seminar-check-popup')}>
          {contents?.isPublic ? (
            <div>
              <div className={cx('mb-5')}>
                <span className={cx('text-bold', 'tw-text-xl', 'tw-font-bold')}>강의클럽가입 신청을 하시겠습니까?</span>
              </div>
              <div>가입 신청 후 클럽장 승인이 완료될때까지 기다려주세요!</div>
              <div>승인 완료 후 MY페이지나 강의클럽 페이지 상단에서 가입된 클럽을 확인하실 수 있습니다.</div>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <div className="tw-mt-5 tw-flex tw-justify-center gap-3">
                <Button
                  color="red"
                  label="강의클럽 가입확인"
                  size="modal"
                  onClick={() => {
                    setIsModalOpen(false);
                    onClubJoin({
                      clubSequence: contents?.clubSequence,
                      participationCode: participationCode,
                    });
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className={cx('mb-5')}>
                <span className={cx('text-bold', 'tw-text-xl', 'tw-font-bold')}>참여코드를 입력해주세요.</span>
              </div>
              <div>참여코드 입력 후 클럽장 승인이 완료될때까지 기다려주세요!</div>
              <div>승인 완료 후 MY페이지나 강의클럽 페이지 상단에서 가입된 클럽을 확인하실 수 있습니다.</div>
              <br></br>
              <br></br>
              <div>
                <TextField
                  placeholder="참여코드를 입력해주세요."
                  value={participationCode}
                  onChange={e => {
                    setParticipationCode(e.target.value);
                  }}
                />
              </div>
              <br></br>
              <div className="tw-mt-5">
                <Button
                  color="red"
                  label="확인"
                  size="modal"
                  onClick={() => {
                    if (participationCode.length === 0) {
                      alert('참여코드를 입력해주세요.');
                    } else {
                      console.log(participationCode, clubData?.clubSequence);
                      onClubJoin({
                        clubSequence: clubData?.clubSequence,
                        participationCode: participationCode,
                      });
                      setIsModalOpen(false);
                      setParticipationCode('');
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LectureDetaillSolution;
