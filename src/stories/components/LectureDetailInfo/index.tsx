// QuizClubDetailInfo.jsx
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useClubJoin } from 'src/services/community/community.mutations';
import { getClubStatusMessage } from 'src/utils/clubStatus';
import { Button, Modal } from 'src/stories/components';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { TextField } from '@mui/material';
import Divider from '@mui/material/Divider';

const cx = classNames.bind(styles);
interface LectureOpenDetailInfoProps {
  border: boolean;
  user: any; // or the specific type expected
  clubData: any; // or the specific type expected
  selectedUniversityName: string;
  jobLevelName: any[]; // or the specific type expected
  selectedQuizzes: any[]; // or the specific type expected
  selectedJobName: any[];
  refetchClubAbout: () => void;
  selectedImageBanner: string;
  selectedImage: string;
  selectedProfile: string;
}

const LectureOpenDetailInfo: React.FC<LectureOpenDetailInfoProps> = ({
  clubData,
  border,
  user,
  selectedQuizzes,
  selectedUniversityName,
  jobLevelName,
  selectedJobName,
  refetchClubAbout,
  selectedImageBanner,
  selectedImage,
  selectedProfile,
}) => {
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [participationCode, setParticipationCode] = useState<string>('');

  const { mutate: onClubJoin, isSuccess: clubJoinSucces } = useClubJoin();

  useEffect(() => {
    if (clubJoinSucces) {
      refetchClubAbout();
    }
  }, [clubJoinSucces]);

  console.log(user);

  const handlerClubJoin = (clubSequence: number, isPublic: boolean) => {
    setIsModalOpen(true);
  };

  return (
    <div className={`tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white ${borderStyle}`}>
      <div className="tw-px-[108.5px] tw-pt-[35px]">
        <div className="tw-w-[980px] tw-h-[77px] tw-relative tw-overflow-hidden tw-border-t-0 tw-border-r-0 tw-border-b-[0.88px] tw-border-l-0 tw-border-[#e9ecf2]">
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-0 tw-top-3.5 tw-gap-[3.5px]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[10.5px] tw-text-left tw-text-[#313b49]">AI조교</p>
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
        <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.5);', paddingY: '10px' }} />
      </div>
      <div className="tw-mt-[40px] ">
        <div className="tw-relative tw-w-full tw-overflow-hidden tw-px-[108.13px] tw-pt-[40px] tw-py-5">
          <div
            style={{
              backgroundImage: `url(${selectedImageBanner})`,
              opacity: 0.3, // Adjust the opacity as needed
            }}
            className="tw-absolute tw-inset-0 tw-bg-cover tw-bg-center"
          ></div>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="start"
            rowSpacing={0}
            className="tw-relative tw-z-10"
          >
            <Grid item xs={8}>
              <div className="tw-flex tw-item tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
                <span className="tw-inline-flex tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
                  {selectedUniversityName || 'N/A'}
                </span>

                <span className="tw-inline-flex tw-bg-red-100 tw-text-red-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded ">
                  {selectedJobName.toString() || 'N/A'}
                </span>
              </div>
              <span className="tw-my-2 tw-inline-flex tw-bg-gray-200 tw-text-gray-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded ">
                {jobLevelName.toString() || 'N/A'}
              </span>
              <div className="tw-text-black tw-text-3xl tw-font-bold tw-py-3">{clubData?.clubName || 'N/A'}</div>
            </Grid>
            <Grid item xs={4} container justifyContent="flex-end">
              <div className="">
                <img
                  alt="강의 이미지"
                  className="tw-w-40 tw-h-40 tw-rounded-lg"
                  src={selectedImage || '/assets/images/banner/Rectangle_190.png'}
                />
                <div className="tw-mt-5">
                  {clubData?.clubAboutStatus === '0300' ? (
                    <button
                      onClick={() => handlerClubJoin(clubData?.clubSequence, clubData?.isPublic)}
                      className="tw-w-40 tw-text-[12.25px] tw-font-bold tw-text-center tw-text-white tw-bg-[#e11837] tw-px-4 tw-py-4 tw-rounded"
                    >
                      참여하기
                    </button>
                  ) : (
                    <>
                      <button className="tw-w-40 tw-text-[12.25px] tw-bg-blue-600 tw-font-bold tw-text-center tw-text-white tw-bg-primary tw-px-4 tw-py-4 tw-rounded">
                        {getClubStatusMessage(clubData?.clubAboutStatus)}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

      <div className="tw-px-[108.5px] tw-absolute tw-top-[330px] tw-left-0 tw-right-0 tw-bottom-0 tw-rounded-[8.75px] tw-py-[40px]">
        <div className="tw-flex tw-items-end tw-gap-[16px]">
          <img
            alt="교수자"
            className="tw-w-40 tw-h-40 border tw-rounded-full"
            src={selectedProfile || '/assets/avatars/1.jpg'}
          />
          <div className="tw-flex">
            <div className="tw-flex tw-justify-center tw-items-center tw-text-sm text-black border tw-py-1 tw-px-2  tw-mr-5 tw-rounded-lg">
              교수자
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21.875px] tw-font-bold tw-text-left tw-text-black">
                {user?.member?.nickname || 'N/A'}
              </p>
            </div>
            <p className="tw-text-[12.25px] tw-text-[#6a7380]">{user?.position}</p>
          </div>
        </div>
      </div>

      <div className="tw-px-[108.5px] tw-py-5 tw-mt-[90px]">
        <div className="tw-flex tw-justify-start tw-items-center border tw-p-3 tw-rounded-lg tw-gap-3">
          <div className="tw-flex tw-text-sm tw-text-black">강의 언어 : </div>
          <div className="tw-flex tw-text-sm tw-text-black border tw-py-1 tw-px-2  tw-mr-5 tw-rounded-lg">
            {clubData?.lectureLanguage === 'kor' ? '한국어' : '영어'}
          </div>
          <div className="tw-flex tw-text-sm tw-text-black">콘텐츠 언어 : </div>
          <div className="tw-flex tw-text-sm tw-text-black border tw-py-1 tw-px-2  tw-mr-5 tw-rounded-lg">
            {clubData?.contentLanguage === 'kor' ? '한국어' : '영어'}
          </div>
          <div className="tw-flex tw-text-sm tw-text-black">AI 대화언어 : </div>
          <div className="tw-flex tw-text-sm tw-text-black border tw-py-1 tw-px-2  tw-mr-5 tw-rounded-lg">
            {clubData?.aiConversationLanguage === 'kor' ? '한국어' : '영어'}
          </div>
        </div>
      </div>

      <div className="tw-px-[108.5px] tw-pt-[10px]">
        <div className=" tw-rounded-[8.75px] tw-mb-[30px] tw-bg-[#F9F9FD]">
          <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
            <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
              <img
                alt="학습 주제"
                src="/assets/images/quiz/Comment_perspective_matte.png"
                className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
              />
            </div>
            <div className="tw-col-start-2 tw-col-end-12 ">
              <div className="tw-flex tw-flex-col">
                <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">학습 주제</p>
                <p className="tw-text-sm tw-text-left tw-text-black">{clubData?.memberIntroductionText}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-rounded-[8.75px] tw-mb-[30px] tw-bg-[#F9F9FD]">
          <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
            <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
              <img
                alt="학습 키워드"
                src="/assets/images/quiz/Message_perspective_matte.png"
                className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
              />
            </div>
            <div className="tw-col-start-2 tw-col-end-12">
              <div className="tw-flex tw-flex-col">
                <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">학습 키워드</p>
                <p className="tw-text-sm tw-text-left tw-text-black">{clubData?.studyKeywords?.toString() || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-rounded-[8.75px] tw-mb-[30px] tw-bg-[#F9F9FD]">
          <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
            <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
              <img
                alt="강의 소개"
                src="/assets/images/quiz/Success_perspective_matte.png"
                className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
              />
            </div>
            <div className="tw-col-start-2 tw-col-end-12">
              <div className="tw-flex tw-flex-col">
                <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">강의 소개</p>
                <p className="tw-text-sm tw-text-left tw-text-black">{clubData?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-rounded-[8.75px] tw-mb-[30px] tw-bg-[#F9F9FD]">
          <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-py-10  tw-p-0">
            <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
              <img
                alt="강의 일정"
                src="/assets/images/quiz/Calendar_perspective_matte.png"
                className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
              />
            </div>
            <div className="tw-col-start-2 tw-col-end-12">
              <div className="tw-flex tw-flex-col">
                <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">강의 일정</p>
                <p className="tw-text-sm tw-text-left tw-text-black">시작일 : {clubData?.startAt?.replace('T', ' ')}</p>
                <p className="tw-text-sm tw-text-left tw-text-black">종료일 : {clubData?.endAt?.replace('T', ' ')}</p>
              </div>
            </div>
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
              <div>승인 완료 후 MY학습방이나 강의클럽 페이지에서 가입된 클럽을 확인하실 수 있습니다.</div>
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
              <div className={cx('tw-my-5')}>
                <span className={cx('text-bold', 'tw-text-xl', 'tw-font-bold')}>참여코드를 입력해주세요.</span>
              </div>
              <div>참여코드 입력 후 클럽장 승인이 완료될때까지 기다려주세요!</div>
              <div>승인 완료 후 MY학습방이나 강의클럽 페이지에서 가입된 클럽을 확인하실 수 있습니다.</div>
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

export default LectureOpenDetailInfo;
