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

export interface AdvisorCardProps {
  advisor: AdvisorData;
  onDelete?: (memberUUID: string) => void;
  showDeleteButton?: boolean;
  className?: string;
}

function AdvisorCard({ advisor, onDelete, showDeleteButton = false, className }: AdvisorCardProps) {
  const handleDeleteClick = () => {
    if (onDelete && window.confirm(`${advisor.nickname} 교수자와의 지도 관계를 해제하시겠습니까?`)) {
      onDelete(advisor.memberUUID);
    }
  };

  return (
    <div
      className={`tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-p-6 tw-shadow-sm tw-transition-all tw-duration-200 hover:tw-shadow-md hover:tw-border-gray-300 ${
        className || ''
      }`}
    >
      {/* Header */}
      <div className="tw-flex tw-items-start tw-justify-between tw-mb-4">
        <div className="tw-flex tw-items-center tw-gap-4">
          <div className="tw-flex-shrink-0">
            <img
              src={advisor.profileImageUrl || '/assets/images/banner/Rectangle_193.png'}
              alt={`${advisor.nickname} 프로필`}
              className="tw-w-16 tw-h-16 tw-rounded-full tw-object-cover tw-border-2 tw-border-gray-200"
              onError={e => {
                (e.target as HTMLImageElement).src = '/assets/images/banner/Rectangle_193.png';
              }}
            />
          </div>
          <div className="tw-flex tw-flex-col tw-gap-1">
            <h3 className="tw-text-lg tw-font-bold tw-text-gray-900 tw-m-0">{advisor.nickname}</h3>
            <p className="tw-text-sm tw-text-gray-600 tw-m-0">{advisor.memberId}</p>
          </div>
        </div>
        {showDeleteButton && onDelete && (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-rounded-full tw-text-gray-400 tw-transition-colors tw-duration-200 tw-border-none tw-bg-transparent tw-cursor-pointer hover:tw-text-red-500 hover:tw-bg-red-50 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-200"
            title="지도 관계 해제"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="tw-space-y-3">
        {/* Badges */}
        <div className="tw-flex tw-flex-wrap tw-gap-2">
          <span className="tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold tw-bg-blue-100 tw-text-blue-700">
            {advisor.jobGroup.name}
          </span>
          <span className="tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold tw-bg-gray-100 tw-text-gray-700">
            {advisor.job.name}
          </span>
        </div>

        {/* Company */}
        {advisor.companyName && (
          <div className="tw-flex tw-items-center tw-gap-2">
            <span className="tw-text-sm tw-font-medium tw-text-gray-700 tw-flex-shrink-0">소속:</span>
            <span className="tw-text-sm tw-text-gray-900">{advisor.companyName}</span>
          </div>
        )}

        {/* Experience */}
        {advisor.experienceYears && (
          <div className="tw-flex tw-items-center tw-gap-2">
            <span className="tw-text-sm tw-font-medium tw-text-gray-700 tw-flex-shrink-0">경력:</span>
            <span className="tw-text-sm tw-text-gray-900">{advisor.experienceYears}년</span>
          </div>
        )}

        {/* Skills */}
        {advisor.skills && advisor.skills.length > 0 && (
          <div className="tw-space-y-2">
            <span className="tw-text-sm tw-font-medium tw-text-gray-700">전문 분야:</span>
            <div className="tw-flex tw-flex-wrap tw-gap-1">
              {advisor.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="tw-px-2 tw-py-1 tw-bg-green-100 tw-text-green-700 tw-text-xs tw-font-medium tw-rounded"
                >
                  {skill.name || skill}
                </span>
              ))}
              {advisor.skills.length > 3 && (
                <span className="tw-px-2 tw-py-1 tw-bg-gray-100 tw-text-gray-600 tw-text-xs tw-font-medium tw-rounded">
                  +{advisor.skills.length - 3}개
                </span>
              )}
            </div>
          </div>
        )}

        {/* Introduction */}
        {advisor.introductionMessage && (
          <div className="tw-space-y-2">
            <span className="tw-text-sm tw-font-medium tw-text-gray-700">소개:</span>
            <p className="tw-text-sm tw-text-gray-700 tw-leading-relaxed tw-m-0">
              {advisor.introductionMessage.length > 100
                ? `${advisor.introductionMessage.substring(0, 100)}...`
                : advisor.introductionMessage}
            </p>
          </div>
        )}

        {/* Footer */}
        {advisor.startAt && (
          <div className="tw-pt-3 tw-border-t tw-border-gray-100 tw-mt-4">
            <span className="tw-text-xs tw-text-gray-500 tw-font-medium">신청일: {advisor.startAt.split(' ')[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvisorCard;
