// QuizClubDetailInfo.jsx
import React from 'react';
import Divider from '@mui/material/Divider';

const QuizClubDetailInfo = ({ clubInfo, border, leaders, clubQuizzes, representativeQuizzes }) => {
  const borderStyle = border ? 'border border-[#e9ecf2] tw-mt-14' : '';
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
            src="/assets/images/quiz/rectangle_183.png"
            className="tw-w-[280px] tw-h-[280px]  tw-left-0 tw-top-[-0.01px] tw-object-cover"
          />
          <p className="tw-absolute tw-left-[305.38px] tw-top-[65.63px] tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black">
            임베디드 시스템
          </p>
          <p className="tw-absolute tw-left-[440.13px] tw-top-[69.13px] tw-text-[12.25px] tw-text-left tw-text-black">
            [전공선택] 3학년 화요일 A반{' '}
          </p>
          <p className="tw-absolute tw-left-[305.38px] tw-top-[118.13px] tw-text-sm tw-text-left tw-text-black">
            <span className="tw-text-sm tw-text-left tw-text-black">학습 주기 : 매주 화요일 (총 12회)</span>
            <br />
            <span className="tw-text-sm tw-text-left tw-text-black">
              학습 기간 : 12주 (2024. 09. 03 ~ 2024. 11. 03)
            </span>
            <br />
            <span className="tw-text-sm tw-text-left tw-text-black">참여 인원 : 24명</span>
          </p>
          <div className="tw-flex tw-justify-start tw-items-start tw-absolute tw-left-[305.38px] tw-top-[24.5px] tw-gap-[7px]">
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] tw-bg-[#d7ecff]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-text-left tw-text-[#235a8d]">
                소프트웨어융합대학
              </p>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] tw-bg-[#e4e4e4]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-text-left tw-text-[#313b49]">
                컴퓨터공학과
              </p>
            </div>
            <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] tw-bg-[#ffdede]">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-text-left tw-text-[#b83333]">3학년</p>
            </div>
          </div>
          <svg
            width={28}
            height={28}
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="tw-w-7 tw-h-7 tw-absolute tw-left-[90%] tw-top-[21px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M25.6663 10.7807L17.278 10.0573L13.9997 2.33398L10.7213 10.069L2.33301 10.7807L8.70301 16.299L6.78967 24.5007L13.9997 20.149L21.2097 24.5007L19.308 16.299L25.6663 10.7807ZM13.9997 17.9673L9.61301 20.6157L10.7797 15.6223L6.90634 12.2623L12.0163 11.819L13.9997 7.11732L15.9947 11.8307L21.1047 12.274L17.2313 15.634L18.398 20.6273L13.9997 17.9673Z"
              fill="#CED4DE"
            />
          </svg>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[305.38px] tw-top-[231px] tw-gap-[7px]">
            <img className="tw-flex-grow-0 tw-flex-shrink-0" src="/assets/images/quiz/ellipse_209_2.png" />
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">양황규 교수</p>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-[87%] tw-top-[220.5px] tw-overflow-hidden tw-gap-[7px] tw-px-[24.5px] tw-py-[10.0625px] tw-rounded-[3.5px] tw-bg-[#e11837]">
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[12.25px] tw-font-bold tw-text-center tw-text-white">
              참여하기
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
              <p className="tw-text-[12.25px] tw-text-left tw-text-black">
                컴공에 대한 기초적인 지식이 있으신 분 학원 공부가 맞지 않으신 분 다른 사람들과 자유롭게 의견 나누면서
                공부하고 싶으신 분 컴퓨터 공학 지식 뿌시고 싶으신 분
              </p>
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
              <p className="tw-text-[12.25px] tw-text-left tw-text-black">
                개발에 대한 기초적인 지식을 기반으로, 퀴즈를 풀고 사람들과 같이 소통하며 지식을 나누며 업그레이드하고,
                다양한 분야의 사람들과 활발한 소통을 통해 비전공자, 전공자 구분없이 커뮤니티 활동을 할 수 있습니다!
              </p>
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
              <p className="tw-text-[12.25px] tw-text-left tw-text-black">
                비전공자 개발자라면, 컴퓨터 공학 지식에 대한 갈증이 있을텐데요, 혼자서는 끝까지 하기 어려운 이 공부,
                우리 같이 퀴즈클럽로 해봐요. 멀리 가려면 함께 가라는 말이 있는데, 우리 전원 퀴즈클럽 달성도 100% 만들고,
                컴퓨터 공학 지식 뿌셔요.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-mt-[40px] ">
        <div className="tw-bg-[#f6f7fb] tw-w-full tw-overflow-hidden tw-px-[108.13px] tw-pt-[40px]">
          <div className=" tw-rounded-[8.75px] tw-py-[40px]">
            <div className="tw-flex tw-items-start tw-gap-[16px]">
              <img src="/assets/images/quiz/ellipse_209.png" />
              <div>
                {/* <h4 className="tw-text-[21.875px] tw-font-bold tw-text-black">{leaders.name}</h4> */}
                <div className="tw-flex tw-justify-start tw-items-center tw-relative tw-gap-[14px] ">
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-[21.875px] tw-font-bold tw-text-left tw-text-black">
                    양황규 교수님
                  </p>
                  <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-gap-[7px]">
                    <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-gap-[7px]">
                      {leaders.departments.map((department, index) => (
                        <div
                          key={index}
                          className={`tw-flex tw-text-sm tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-[8.75px] tw-px-[10.5px] tw-py-[3.5px] tw-rounded-[3.5px] tw-bg-[#e4e4e4]`}
                        >
                          <p className={department.textColor}>{department.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="tw-text-[12.25px] tw-text-[#6a7380]">{leaders.position}</p>

                <div className="tw-flex tw-gap-2.5 tw-mt-3">
                  {leaders.tags.map((tag, index) => (
                    <div key={index} className="tw-bg-[#313b49] tw-rounded-[3.5px] tw-px-[7px] tw-py-[1.75px]">
                      <p className="tw-text-[10.5px] tw-text-white">{tag}</p>
                    </div>
                  ))}
                </div>
                <p className="tw-text-[12.25px] tw-text-black tw-mt-3">{leaders.greeting}</p>
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
                  <p className="tw-text-[12.25px] tw-text-left tw-text-black">
                    안녕하세요. 이 퀴즈 클럽을 운영하게 된 양황규 교수입니다! 만나서 반가워요. 저도 다른 교수자님들의
                    도움을 받아 이 자리까지 오게 되었네요! 함께 성장해봅시다.
                  </p>
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
                  <p className="tw-text-[12.25px] tw-text-left tw-text-black">
                    (현) 카카오 개발 리더 (전) 네이버 개발 팀장 (전) 안랩 개발 사원 (전) 카카오 개발 인턴 카카오
                    모빌리티 앱 개발 애플워치 ios 개발 네이버 쇼핑 어플 UI 개발
                  </p>
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
                2023.06.01 - 2023.06.18 / 주2회(월, 수) 총 36개 퀴즈
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
              <p className="tw-text-[17.5px] tw-font-bold tw-text-left tw-text-black tw-pb-5">
                우리 클럽을 통해 얻을 수 있는 것은 무엇인가요?
              </p>
              {representativeQuizzes.map((quiz, index) => (
                <div key={index} className="tw-mt-3.5 tw-flex tw-items-center tw-gap-3">
                  <div className="tw-bg-[#e11837] tw-rounded-[3.5px] tw-px-[7px] tw-py-[1.75px]">
                    <p className="tw-text-[10.5px] tw-font-bold tw-text-white">대표 {index + 1}</p>
                  </div>
                  <p className="tw-text-sm tw-text-black">{quiz.question}</p>
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
