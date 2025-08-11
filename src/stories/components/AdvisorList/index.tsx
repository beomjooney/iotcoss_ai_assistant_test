import React from 'react';

export interface AdvisorData {
  memberUUID: string;
  memberId: string;
  memberUri: string;
  profileImageUrl: string | null;
  nickname: string;
  jobGroup: {
    code: string;
    name: string;
  };
  job: {
    code: string;
    name: string;
  };
  companyName: string | null;
  experienceYears: number | null;
  skills: any[];
  introductionMessage: string | null;
  startAt?: string; // 신청일 정보 (선택적)
  status?: string; // 상태 정보 (선택적)
}

export interface AdvisorListProps {
  advisors: AdvisorData[];
  onDelete?: (memberUUID: string) => void;
  showDeleteButton?: boolean;
  className?: string;
}

function AdvisorList({ advisors, onDelete, showDeleteButton = false, className }: AdvisorListProps) {
  const handleDeleteClick = (advisor: AdvisorData) => {
    if (onDelete && window.confirm(`${advisor.nickname} 지도교수자를 삭제하시겠습니까?`)) {
      onDelete(advisor.memberUUID);
    }
  };

  if (advisors.length === 0) {
    return (
      <div className="tw-text-center tw-w-full tw-border tw-border-gray-200 tw-rounded-md">
        <div className="tw-p-10 tw-mb-5">
          <div className="tw-p-10 tw-text-gray-600">지도교수자가 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`tw-w-full tw-space-y-5 ${className || ''}`}>
      {/* 헤더 */}

      {/* 리스트 아이템들 */}
      {advisors.map((advisor, index) => (
        <div key={advisor.memberUUID || index} className="tw-bg-white border tw-rounded-lg  tw-p-6 ">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-center">
            {/* 교수자 정보 */}
            <div className="tw-col-span-4 tw-flex tw-items-center tw-gap-3">
              <div className="tw-flex-shrink-0">
                <img
                  src={advisor.profileImageUrl || '/assets/images/banner/Rectangle_193.png'}
                  alt={`${advisor.nickname} 프로필`}
                  className="tw-w-9 tw-h-9 tw-rounded-full tw-object-cover tw-border-2 tw-border-gray-200"
                  onError={e => {
                    (e.target as HTMLImageElement).src = '/assets/images/banner/Rectangle_193.png';
                  }}
                />
              </div>

              <div className="tw-min-w-0 tw-flex-1 ">
                <div className="tw-text-sm tw-font-semibold tw-text-gray-900 tw-truncate tw-flex tw-items-center tw-gap-2">
                  <span className="tw-inline-flex tw-px-2 tw-py-1 tw-rounded-lg tw-text-xs tw-font-semibold border tw-text-gray-700">
                    교수자
                  </span>
                  {advisor.nickname}
                </div>
                {advisor.introductionMessage && (
                  <p className="tw-text-xs tw-text-gray-500 tw-mt-1 tw-line-clamp-2">
                    {advisor.introductionMessage.length > 80
                      ? `${advisor.introductionMessage.substring(0, 80)}...`
                      : advisor.introductionMessage}
                  </p>
                )}
              </div>
            </div>

            {/* 이메일 */}
            <div className="tw-col-span-2 tw-flex tw-items-center">
              <span className="tw-text-sm tw-text-gray-900 tw-truncate">{advisor.memberId}</span>
            </div>

            {/* 직군 */}
            <div className="tw-col-span-2 tw-flex tw-items-center">
              <span className="tw-inline-flex tw-px-2 tw-py-1 tw-rounded-lg tw-text-xs tw-font-semibold tw-bg-blue-100 tw-text-blue-700 tw-truncate tw-max-w-full tw-text-center">
                {advisor.jobGroup.name}
              </span>
            </div>

            {/* 직무 */}
            <div className={`${showDeleteButton ? 'tw-col-span-3' : 'tw-col-span-3'} tw-flex tw-items-center`}>
              <span className="tw-inline-flex tw-px-2 tw-py-1 tw-rounded-lg tw-text-xs tw-font-semibold tw-bg-gray-100 tw-text-gray-700 tw-truncate tw-max-w-full">
                {advisor.job.name}
              </span>
            </div>

            {/* 관리 - 맨 마지막에 배치 */}
            {showDeleteButton && (
              <div className="tw-col-span-1 tw-flex tw-items-center tw-justify-center">
                <button
                  type="button"
                  onClick={() => handleDeleteClick(advisor)}
                  className="tw-inline-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full tw-text-gray-400 tw-transition-colors tw-duration-200 tw-border-none tw-bg-transparent tw-cursor-pointer"
                  title="지도 관계 해제"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 28 28" fill="none">
                    <rect width="28" height="28" rx="4" fill="#CED4DE" />
                    <path d="M20 8L8 20" stroke="white" stroke-width="1.5" />
                    <path d="M8 8L20 20" stroke="white" stroke-width="1.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdvisorList;
