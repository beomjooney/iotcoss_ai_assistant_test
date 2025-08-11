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

export interface AdvisorTableProps {
  advisors: AdvisorData[];
  onDelete?: (memberUUID: string) => void;
  showDeleteButton?: boolean;
  className?: string;
}

function AdvisorTable({ advisors, onDelete, showDeleteButton = false, className }: AdvisorTableProps) {
  const handleDeleteClick = (advisor: AdvisorData) => {
    if (onDelete && window.confirm(`${advisor.nickname} 교수자와의 지도 관계를 해제하시겠습니까?`)) {
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
    <div
      className={`tw-w-full tw-overflow-hidden tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white ${
        className || ''
      }`}
    >
      <div className="tw-overflow-x-auto">
        <table className="tw-w-full tw-border-collapse">
          <tbody>
            {advisors.map((advisor, index) => (
              <tr
                key={advisor.memberUUID || index}
                className="tw-border-b tw-border-gray-100 hover:tw-bg-gray-50 tw-transition-colors"
              >
                {/* 교수자 정보 */}
                <td className="tw-py-4 tw-px-6">
                  <div className="tw-flex tw-items-center tw-gap-3">
                    <div className="tw-flex-shrink-0">
                      <img
                        src={advisor.profileImageUrl || '/assets/images/banner/Rectangle_193.png'}
                        alt={`${advisor.nickname} 프로필`}
                        className="tw-w-10 tw-h-10 tw-rounded-full tw-object-cover tw-border-2 tw-border-gray-200"
                        onError={e => {
                          (e.target as HTMLImageElement).src = '/assets/images/banner/Rectangle_193.png';
                        }}
                      />
                    </div>
                    <div>
                      <div className="tw-text-sm tw-font-semibold tw-text-gray-900">{advisor.nickname}</div>
                      {advisor.introductionMessage && (
                        <div className="tw-text-xs tw-text-gray-500 tw-mt-1 tw-max-w-xs tw-truncate">
                          {advisor.introductionMessage.length > 50
                            ? `${advisor.introductionMessage.substring(0, 50)}...`
                            : advisor.introductionMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* 이메일 */}
                <td className="tw-py-4 tw-px-6">
                  <div className="tw-text-sm tw-text-gray-900">{advisor.memberId}</div>
                </td>

                {/* 직군/직무 */}
                <td className="tw-py-4 tw-px-6">
                  <div className="tw-flex tw-flex-col tw-gap-1">{advisor.jobGroup.name}</div>
                </td>

                {/* 소속/경력 */}
                <td className="tw-py-4 tw-px-6">
                  <div className="tw-text-sm tw-text-gray-900">{advisor.job.name}</div>
                </td>
                <td className="tw-py-4 tw-px-6">
                  <div className="tw-text-sm tw-text-gray-900">
                    {advisor.companyName && <div className="tw-mb-1">{advisor.companyName}</div>}
                    {advisor.experienceYears && (
                      <div className="tw-text-xs tw-text-gray-500">경력 {advisor.experienceYears}년</div>
                    )}
                    {!advisor.companyName && !advisor.experienceYears && <span className="tw-text-gray-400">-</span>}
                  </div>
                </td>

                {/* 전문분야 */}
                <td className="tw-py-4 tw-px-6">
                  {advisor.skills && advisor.skills.length > 0 ? (
                    <div className="tw-flex tw-flex-wrap tw-gap-1">
                      {advisor.skills.slice(0, 2).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="tw-inline-flex tw-px-2 tw-py-1 tw-bg-green-100 tw-text-green-700 tw-text-xs tw-font-medium tw-rounded"
                        >
                          {skill.name || skill}
                        </span>
                      ))}
                      {advisor.skills.length > 2 && (
                        <span className="tw-inline-flex tw-px-2 tw-py-1 tw-bg-gray-100 tw-text-gray-600 tw-text-xs tw-font-medium tw-rounded">
                          +{advisor.skills.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="tw-text-gray-400">-</span>
                  )}
                </td>

                {/* 신청일 */}
                {advisors.some(a => a.startAt) && (
                  <td className="tw-py-4 tw-px-6">
                    {advisor.startAt ? (
                      <div className="tw-text-sm tw-text-gray-900">{advisor.startAt.split(' ')[0]}</div>
                    ) : (
                      <span className="tw-text-gray-400">-</span>
                    )}
                  </td>
                )}

                {/* 관리 */}
                {showDeleteButton && (
                  <td className="tw-py-4 tw-px-6 tw-text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(advisor)}
                      className="tw-inline-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full tw-text-gray-400 tw-transition-colors tw-duration-200 tw-border-none tw-bg-transparent tw-cursor-pointer hover:tw-text-red-500 hover:tw-bg-red-50 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-200"
                      title="지도 관계 해제"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdvisorTable;
