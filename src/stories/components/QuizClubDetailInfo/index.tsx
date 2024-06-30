// QuizClubDetailInfo.jsx
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useClubJoin } from 'src/services/community/community.mutations';
import { useSessionStore } from 'src/store/session';
import { useSaveLike, useDeleteLike } from 'src/services/community/community.mutations';
import { getClubStatusMessage } from 'src/utils/clubStatus';
import { Button, Modal } from 'src/stories/components';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { TextField } from '@mui/material';

const cx = classNames.bind(styles);
interface QuizClubDetailInfoProps {
  border: boolean;
  user: any; // or the specific type expected
  clubData: any; // or the specific type expected
  selectedUniversityName: string;
  jobLevelName: any[]; // or the specific type expected
  selectedQuizzes: any[]; // or the specific type expected
  selectedJobName: string;
  refetchClubAbout: () => void;
}

const QuizClubDetailInfo: React.FC<QuizClubDetailInfoProps> = ({
  clubData,
  border,
  user,
  selectedQuizzes,
  selectedUniversityName,
  jobLevelName,
  selectedJobName,
  refetchClubAbout,
}) => {
  const { logged } = useSessionStore.getState();
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
  const studyWeekCount = parseInt(clubData?.studyWeekCount, 10);
  const totalMeetings = studyWeekCount * clubData?.studyCycle?.length;
  const { mutate: onClubJoin, isSuccess: clubJoinSucces } = useClubJoin();
  let [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [participationCode, setParticipationCode] = useState<string>('');

  const { mutate: onSaveLike, isSuccess } = useSaveLike();
  const { mutate: onDeleteLike } = useDeleteLike();

  useEffect(() => {
    setIsLiked(clubData.isFavorite);
  }, [clubData.isFavorite]);

  useEffect(() => {
    if (clubJoinSucces) {
      refetchClubAbout();
    }
  }, [clubJoinSucces]);

  const handlerClubJoin = (clubSequence: number, isPublic: boolean) => {
    setIsModalOpen(true);
    // onClubJoin({
    //   clubSequence: clubSequence,
    //   participationCode: '',
    // });
  };

  const onChangeLike = function (postNo: number) {
    event.preventDefault();
    if (logged) {
      setIsLiked(!isLiked);
      if (isLiked) {
        onDeleteLike(postNo);
      } else {
        onSaveLike(postNo);
      }
    } else {
      alert('로그인 후 좋아요를 클릭 할 수 있습니다.');
    }
  };

  return (
    <div className={`tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white ${borderStyle}`}>
      <div className="tw-px-[108.5px] tw-pt-[35px]">
        <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden tw-border-t-0 tw-border-r-0 tw-border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">퀴즈클럽</p>
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
              클럽 상세보기
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-0 tw-top-[31.5px] tw-gap-3.5">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21px] tw-font-bold tw-text-left tw-text-black">
              클럽 상세보기
            </p>
          </div>
        </div>

        <div className=" tw-flex tw-flex-col tw-bg-white border tw-rounded-lg md:tw-flex-row tw-w-full ">
          <img
            className="tw-object-cover border-right  tw-w-[280px] tw-rounded-t-lg tw-h-[280px]"
            src={clubData?.clubImageUrl}
            alt=""
          />

          <div className="tw-flex tw-w-full tw-flex-col tw-p-7 tw-pb-0">
            <Grid container direction="row" justifyContent="space-between" alignItems="center" rowSpacing={0}>
              <Grid item xs={12}>
                <div className="tw-flex tw-item tw-text-base tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                  <span className="tw-inline-flex tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
                    {clubData?.jobGroups?.length > 0 ? clubData.jobGroups[0]?.name : 'N/A'}
                  </span>

                  <span className="tw-inline-flex tw-bg-gray-100 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded ">
                    {clubData?.jobs?.length > 0 ? clubData.jobs[0]?.name : 'N/A'}
                  </span>
                  <span className="tw-inline-flex tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded ">
                    {clubData?.jobLevels?.length > 0 ? clubData.jobLevels[0]?.name : 'N/A'}
                  </span>
                  <button
                    className="tw-inline-flex tw-ml-auto"
                    onClick={() => {
                      onChangeLike(clubData.clubSequence, clubData.isFavorite);
                    }}
                  >
                    {isLiked ? (
                      <StarIcon sx={{ fontSize: 24 }} color="error" />
                    ) : (
                      <StarBorderIcon sx={{ fontSize: 24 }} color="disabled" />
                    )}
                  </button>
                </div>
              </Grid>
            </Grid>
            <div className=" tw-flex tw-items-center tw-pt-8">
              <div className="tw-line-clamp-1 tw-text-xl tw-font-bold  tw-text-[#000000] tw-mr-2">{clubData?.name}</div>
              <div className="tw-line-clamp-1 tw-text-base  tw-text-[#000000]">{clubData?.description}</div>
            </div>
            <div className="tw-py-5 tw-text-black tw-text-base tw-mb-[12px] tw-font-medium">
              <div>
                학습 기간 : 매주 {clubData?.studyCycle?.toString() || 'N/A'}요일 (총 {clubData?.studyWeekCount || 'N/A'}
                주)
              </div>
              <div>
                학습 참여 : {clubData?.studyWeekCount || 'N/A'} 주 ({clubData?.startAt} ~ {clubData?.endAt})
              </div>
              <div>참여 인원 : {clubData?.recruitedMemberCount}명</div>
            </div>

            <div className="tw-flex tw-items-center tw-text-base tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
              <div className="tw-inline-flex tw-items-center tw-gap-4">
                <img
                  className="tw-w-8 tw-h-8 tw-ring-1 tw-rounded-full"
                  src={clubData?.leader?.profileImageUrl}
                  alt=""
                />
                <div className="tw-text-sm tw-font-semibold tw-text-black">
                  <div>{clubData?.leader?.nickname}</div>
                </div>
              </div>

              <div className="tw-inline-flex tw-ml-auto">
                <div className="tw-flex tw-items-center tw-space-x-4">
                  <div className="tw-flex tw-ml-auto tw-items-center tw-space-x-4">
                    {clubData?.clubAboutStatus === '0300' ? (
                      <button
                        onClick={() => handlerClubJoin(clubData?.clubSequence, clubData?.isPublic)}
                        className="tw-text-[12.25px] tw-font-bold tw-text-center tw-text-white tw-bg-[#e11837] tw-px-4 tw-py-2 tw-rounded"
                      >
                        참여하기
                      </button>
                    ) : (
                      <>
                        <button className="tw-text-[12.25px] tw-font-bold tw-text-center tw-text-white tw-bg-black tw-px-4 tw-py-2 tw-rounded">
                          {getClubStatusMessage(clubData?.clubAboutStatus)}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-pt-10">
          <div className="tw-col-start-1 tw-col-end-2 tw-flex tw-justify-center">
            <img
              src="/assets/images/quiz/Success_perspective_matte.png"
              className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
            />
          </div>
          <div className="tw-col-start-2 tw-col-end-13">
            <div className="tw-flex tw-flex-col tw-gap-0">
              <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-1">간단 클럽 소개</p>
              <p className="tw-text-sm tw-text-left tw-text-black">{clubData?.introductionText}</p>
            </div>
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-pt-10">
          <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
            <img
              src="/assets/images/quiz/User_perspective_matte.png"
              className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
            />
          </div>
          <div className="tw-col-start-2 tw-col-end-13">
            <div className="tw-flex tw-flex-col">
              <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black  tw-pb-5">
                이런 분께 가입 추천드립니다
              </p>
              <p className="tw-text-sm tw-text-left tw-text-black">{clubData?.recommendationText}</p>
            </div>
          </div>
        </div>
        <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-pt-10">
          <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
            <img
              src="/assets/images/quiz/Trophy_perspective_matte.png"
              className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
            />
          </div>
          <div className="tw-col-start-2 tw-col-end-13">
            <div className="tw-flex tw-flex-col">
              <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">
                우리 클럽을 통해 얻을 수 있는 것은 무엇인가요?
              </p>
              <p className="tw-text-sm tw-text-left tw-text-black">{clubData?.learningText}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-mt-[40px] ">
        <div className="tw-bg-[#f6f7fb] tw-w-full tw-overflow-hidden tw-px-[108.13px] tw-pt-[40px]">
          <div className=" tw-rounded-[8.75px] tw-py-[40px]">
            <div className="tw-flex tw-items-start tw-gap-[16px]">
              <img className="tw-w-28 tw-h-28 border tw-rounded-full" src={user?.profileImageUrl} />
              <div>
                <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-[14px]  tw-gap-3">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21.875px] tw-font-bold tw-text-left tw-text-black">
                    {user?.name ? user?.name : user?.nickname} 교수님
                  </p>

                  <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0">
                    <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-gap-3">
                      <div
                        className={`tw-bg-[#d7ecff] tw-flex tw-text-sm tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] `}
                      >
                        <p className="">{user?.jobGroup?.name || 'N/A'}</p>
                      </div>
                      <div
                        className={`tw-bg-[#e4e4e4] tw-flex tw-text-sm tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] `}
                      >
                        <p className="">{user?.job?.name || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="tw-text-[12.25px] tw-text-[#6a7380]">{user?.position}</p>

                <div className="tw-flex tw-gap-2.5 tw-mt-3">
                  {user?.skills?.map((tag, index) => (
                    <div key={index} className="tw-bg-[#313b49] tw-rounded-[3.5px] tw-px-[7px] tw-py-[1.75px]">
                      <p className="tw-text-sm tw-text-white">{tag}</p>
                    </div>
                  ))}
                </div>
                <p className="tw-text-sm tw-text-black tw-mt-3">{user?.introductionMessage}</p>
              </div>
            </div>
          </div>
          <div className="tw-bg-white tw-rounded-[8.75px] tw-mb-[30px]">
            <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
              <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
                <img
                  src="/assets/images/quiz/Comment_perspective_matte.png"
                  className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
                />
              </div>
              <div className="tw-col-start-2 tw-col-end-12">
                <div className="tw-flex tw-flex-col">
                  <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">리더 인사</p>
                  <p className="tw-text-sm tw-text-left tw-text-black">{clubData?.memberIntroductionText}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-bg-white tw-rounded-[8.75px] tw-mb-[30px]">
            <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
              <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
                <img
                  src="/assets/images/quiz/Crown_perspective_matte.png"
                  className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
                />
              </div>
              <div className="tw-col-start-2 tw-col-end-12">
                <div className="tw-flex tw-flex-col">
                  <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">리더 이력 및 경력</p>
                  <p className="tw-text-sm tw-text-left tw-text-black">{clubData?.careerText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-px-[108.5px] tw-pt-[10px]">
        <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
          <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
            <img
              src="/assets/images/quiz/Calendar_perspective_matte.png"
              className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
            />
          </div>
          <div className="tw-col-start-2 tw-col-end-13">
            <div className="tw-flex tw-flex-col">
              <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">퀴즈 전체 일정</p>
              <p className="tw-text-sm tw-text-left tw-text-black">
                {clubData?.startAt} / 주 {clubData?.studyWeekCount?.toString()}회({clubData?.studyCycle?.toString()}) 총{' '}
                {selectedQuizzes?.length}개 퀴즈
              </p>
            </div>
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-pt-5 tw-pb-10">
          <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
            <img
              src="/assets/images/quiz/Message_perspective_matte.png"
              className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
            />
          </div>
          <div className="tw-col-start-2 tw-col-end-13">
            <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">우리 클럽 대표퀴즈</p>
            {selectedQuizzes?.slice(0, 3).map((quiz, index) => (
              <div key={index} className="tw-mt-3.5 tw-flex tw-items-start tw-gap-5">
                <div className="flex-none tw-w-16 tw-text-center tw-bg-[#e11837] tw-rounded-[3.5px] tw-py-1">
                  <p className="tw-text-sm tw-font-bold tw-text-white">대표 {index + 1}</p>
                </div>
                <div className="flex-initial tw-w-full tw-text-base tw-text-black">{quiz.question || quiz.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onAfterClose={() => setIsModalOpen(false)} title="" maxWidth="900px">
        <div className={cx('seminar-check-popup')}>
          {clubData?.isPublic ? (
            <div>
              <div className={cx('mb-5')}>
                <span className={cx('text-bold', 'tw-text-xl', 'tw-font-bold')}>가입 신청이 완료되었습니다!</span>
              </div>
              <div>가입 신청 후 클럽장 승인이 완료될때까지 기다려주세요!</div>
              <div>승인 완료 후 MY페이지나 퀴즈클럽 페이지 상단에서 가입된 클럽을 확인하실 수 있습니다.</div>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <div className="tw-mt-5">
                <Button
                  color="red"
                  label="확인"
                  size="modal"
                  onClick={() => {
                    setIsModalOpen(false);
                    onClubJoin({
                      clubSequence: clubData?.clubSequence,
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
              <div>승인 완료 후 MY페이지나 퀴즈클럽 페이지 상단에서 가입된 클럽을 확인하실 수 있습니다.</div>
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

export default QuizClubDetailInfo;
