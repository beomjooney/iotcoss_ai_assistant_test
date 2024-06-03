// QuizClubDetailInfo.jsx
import React from 'react';

interface QuizClubDetailInfoProps {
  border: boolean;
  clubData: any; // or the specific type expected
  user: any; // or the specific type expected
  selectedUniversityName: string;
  jobLevelName: any[]; // or the specific type expected
  selectedQuizzes: any[]; // or the specific type expected
  selectedJobName: string;
}

const getButtonText = status => {
  switch (status) {
    case '0002':
      return '가입완료';
    case '0200':
      return '개설 예정';
    case '0210':
      return '개설 연기';
    case '0220':
      return '취소';
    case '0300':
      return '모집중';
    case '0310':
      return '모집완료';
    case '0500':
      return '완료';
  }
};

const QuizClubDetailInfo: React.FC<QuizClubDetailInfoProps> = ({
  clubData,
  border,
  user,
  selectedQuizzes,
  selectedUniversityName,
  jobLevelName,
  selectedJobName,
}) => {
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
  const studyWeekCount = parseInt(clubData?.studyWeekCount, 10);
  const totalMeetings = studyWeekCount * clubData?.studyCycle?.length;
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
        <div className="tw-h-[280px] tw-relative tw-overflow-hidden tw-rounded-[8.75px] tw-bg-white border tw-border-[#e9ecf2]">
          <img
            src={clubData?.clubImageUrl}
            className="tw-w-[280px] tw-h-[280px]  tw-left-0 tw-top-[-0.01px] tw-object-cover"
          />
          <p className="tw-absolute tw-left-[305.38px] tw-top-[65.63px] tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black">
            {clubData?.clubName}
          </p>
          <p className="tw-absolute tw-left-[305.38px] tw-top-[118.13px] tw-text-sm tw-text-left tw-text-black">
            <span className="tw-text-sm tw-text-left tw-text-black">
              학습 주기 : {clubData?.studyWeekCount}주 {clubData?.studyCycle?.toString()}요일 (총 {totalMeetings}회)
            </span>
            <br />
            <span className="tw-text-sm tw-text-left tw-text-black">
              학습 기간 : {clubData?.num}주 {clubData?.startAt}
            </span>
            <br />
            {/* <span className="tw-text-sm tw-text-left tw-text-black">참여 인원 : 24명</span> */}
          </p>
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-[305.38px] tw-top-[24.5px] tw-gap-[7px]">
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] tw-bg-[#d7ecff]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-text-left tw-text-[#235a8d]">
                {selectedUniversityName}
              </p>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] tw-bg-[#e4e4e4]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-text-left tw-text-[#313b49]">
                {selectedJobName}
              </p>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] tw-bg-[#ffdede]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-text-left tw-text-[#b83333]">
                {jobLevelName}
              </p>
            </div>
          </div>
          <svg
            width={28}
            height={28}
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="tw-w-7 tw-h-7 tw-absolute tw-right-5 tw-top-[21px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M25.6663 10.7807L17.278 10.0573L13.9997 2.33398L10.7213 10.069L2.33301 10.7807L8.70301 16.299L6.78967 24.5007L13.9997 20.149L21.2097 24.5007L19.308 16.299L25.6663 10.7807ZM13.9997 17.9673L9.61301 20.6157L10.7797 15.6223L6.90634 12.2623L12.0163 11.819L13.9997 7.11732L15.9947 11.8307L21.1047 12.274L17.2313 15.634L18.398 20.6273L13.9997 17.9673Z"
              fill="#CED4DE"
            />
          </svg>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[305.38px] tw-top-[231px] tw-gap-[7px]">
            <img
              className="tw-flex-grow-0 tw-flex-shrink-0 border tw-rounded-full"
              src={user?.profileImageUrl}
              width="25"
              height="25"
            />
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
              {user?.name ? user?.name : user?.nickname} 교수
            </p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[87%] tw-top-[220.5px] tw-overflow-hidden tw-gap-[7px] tw-px-[24.5px] tw-py-[10.0625px] tw-rounded-[3.5px] tw-bg-[#e11837]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-font-bold tw-text-center tw-text-white">
              {getButtonText(clubData?.clubStatus)}
            </p>
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-pt-10">
          <div className="tw-col-start-1 tw-col-end-2 tw-flex tw-justify-center">
            <img
              src="/assets/images/quiz/success_perspective_matte.png"
              className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
            />
          </div>
          <div className="tw-col-start-2 tw-col-end-13">
            <div className="tw-flex tw-flex-col tw-gap-0">
              <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-1">간단 클럽 소개</p>
              <p className="tw-text-[12.25px] tw-text-left tw-text-black">{clubData?.introductionText}</p>
            </div>
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-pt-10">
          <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
            <img
              src="/assets/images/quiz/user_perspective_matte.png"
              className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
            />
          </div>
          <div className="tw-col-start-2 tw-col-end-13">
            <div className="tw-flex tw-flex-col">
              <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black  tw-pb-5">
                이런 분께 가입 추천드립니다
              </p>
              <p className="tw-text-[12.25px] tw-text-left tw-text-black">{clubData?.recommendationText}</p>
            </div>
          </div>
        </div>
        <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-pt-10">
          <div className="tw-col-start-1 tw-col-end-1 tw-flex tw-justify-center">
            <img
              src="/assets/images/quiz/trophy_perspective_matte.png"
              className="tw-max-w-[22.75px] tw-max-h-[23.19px] tw-object-cover"
            />
          </div>
          <div className="tw-col-start-2 tw-col-end-13">
            <div className="tw-flex tw-flex-col">
              <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">
                우리 클럽을 통해 얻을 수 있는 것은 무엇인가요?
              </p>
              <p className="tw-text-[12.25px] tw-text-left tw-text-black">{clubData?.learningText}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-mt-[40px] ">
        <div className="tw-bg-[#f6f7fb] tw-w-full tw-overflow-hidden tw-px-[108.13px] tw-pt-[40px]">
          <div className=" tw-rounded-[8.75px] tw-py-[40px]">
            <div className="tw-flex tw-items-start tw-gap-[16px]">
              <img className="border tw-rounded-full" src={user?.profileImageUrl} width="105" height="105" />
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
                        <p className="">{user?.jobGroup?.name}</p>
                      </div>
                      <div
                        className={`tw-bg-[#e4e4e4] tw-flex tw-text-sm tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] `}
                      >
                        <p className="">{user?.job?.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="tw-text-[12.25px] tw-text-[#6a7380]">{user?.position}</p>

                <div className="tw-flex tw-gap-2.5 tw-mt-3">
                  {user?.skills?.map((tag, index) => (
                    <div key={index} className="tw-bg-[#313b49] tw-rounded-[3.5px] tw-px-[7px] tw-py-[1.75px]">
                      <p className="tw-text-[10.5px] tw-text-white">{tag}</p>
                    </div>
                  ))}
                </div>
                <p className="tw-text-[12.25px] tw-text-black tw-mt-3">{user?.introductionMessage}</p>
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
                  <p className="tw-text-[12.25px] tw-text-left tw-text-black">{clubData?.memberIntroductionText}</p>
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
                  <p className="tw-text-[12.25px] tw-text-left tw-text-black">{clubData?.careerText}</p>
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
              <p className="tw-text-[12.25px] tw-text-left tw-text-black">
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
            <div className="tw-flex tw-flex-col">
              <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">우리 클럽 대표퀴즈</p>
              {selectedQuizzes?.slice(0, 3).map((quiz, index) => (
                <div key={index} className="tw-mt-3.5 tw-flex tw-items-center tw-gap-3">
                  <div className="tw-bg-[#e11837] tw-rounded-[3.5px] tw-px-[7px] tw-py-[1.75px]">
                    <p className="tw-text-[10.5px] tw-font-bold tw-text-white">대표 {index + 1}</p>
                  </div>
                  <p className="tw-text-sm tw-text-black">{quiz.question || quiz.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizClubDetailInfo;
