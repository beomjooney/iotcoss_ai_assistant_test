import React, { useState } from 'react';
import { MemberSortRadio } from '../index';

export interface ProfessorData {
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
}

export interface ProfessorListProps {
  professors: ProfessorData[];
  onConfirmSelection?: (selectedUUIDs: string[]) => void;
  isLoading?: boolean;
  searchKeyword?: string;
  onSearchChange?: (keyword: string) => void;
  totalElement?: number;
  memberSortType?: string;
  onSortChange?: (sortType: string) => void;
}

function ProfessorList({
  professors,
  onConfirmSelection,
  isLoading = false,
  searchKeyword = '',
  onSearchChange,
  totalElement,
  memberSortType = '0100',
  onSortChange,
}: ProfessorListProps) {
  const [selectedUUIDs, setSelectedUUIDs] = useState<string[]>([]);

  // 디버깅을 위한 useEffect
  React.useEffect(() => {
    console.log('선택된 UUIDs 업데이트:', selectedUUIDs);
  }, [selectedUUIDs]);

  const handleCheckboxChange = (memberUUID: string, isChecked: boolean) => {
    console.log('체크박스 변경:', memberUUID, isChecked);
    if (isChecked) {
      setSelectedUUIDs(prev => [...prev, memberUUID]);
    } else {
      setSelectedUUIDs(prev => prev.filter(uuid => uuid !== memberUUID));
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    console.log('전체 선택:', isChecked);
    if (isChecked) {
      setSelectedUUIDs(professors.map(p => p.memberUUID));
    } else {
      setSelectedUUIDs([]);
    }
  };

  const handleConfirm = () => {
    console.log('현재 선택된 UUIDs:', selectedUUIDs);
    if (selectedUUIDs.length === 0) {
      alert('선택된 교수자가 없습니다.');
      return;
    }
    onConfirmSelection?.(selectedUUIDs);
  };
  if (isLoading) {
    return (
      <div className="tw-w-full tw-flex tw-justify-center tw-items-center tw-min-h-[200px]">
        <div className="tw-text-base tw-text-gray-600 tw-text-center">교수자 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="tw-w-full tw-h-full tw-flex tw-flex-col">
      <div className="tw-pb-5 tw-border-b tw-border-gray-200 tw-flex-shrink-0">
        <div className="tw-flex tw-justify-between tw-items-center">
          <div className="tw-text-2xl tw-font-bold tw-text-gray-900">교수자 목록 ({totalElement}명)</div>

          <div className="tw-flex tw-gap-3 tw-items-center">
            {onSortChange && <MemberSortRadio value={memberSortType} onChange={onSortChange} />}
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              value={searchKeyword}
              onChange={e => onSearchChange?.(e.target.value)}
              className="tw-w-64 tw-h-10 tw-rounded-md tw-border tw-border-gray-300 tw-px-4 tw-text-sm tw-text-gray-600 focus:tw-border-blue-500 focus:tw-outline-none"
            />
            <button
              onClick={handleConfirm}
              disabled={selectedUUIDs.length === 0}
              className="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-text-sm tw-font-medium tw-rounded hover:tw-bg-blue-600 tw-transition-colors disabled:tw-bg-gray-300 disabled:tw-cursor-not-allowed"
            >
              확인 ({selectedUUIDs.length})
            </button>
          </div>
        </div>
      </div>

      <div className="tw-flex-1 tw-overflow-hidden">
        <div className="tw-h-full tw-overflow-x-auto">
          <div className="tw-h-[430px] tw-overflow-y-auto tw-border tw-border-gray-200 tw-rounded-lg">
            <table className="tw-w-full tw-border-collapse">
              <thead>
                <tr className="tw-bg-gray-50 tw-border-b tw-border-gray-200">
                  <th className="tw-text-center tw-py-5 tw-px-4 tw-text-sm tw-font-semibold tw-text-gray-700 tw-align-middle">
                    <label className="tw-flex tw-items-center tw-justify-center tw-cursor-pointer">
                      <input
                        type="checkbox"
                        checked={professors.length > 0 && selectedUUIDs.length === professors.length}
                        onChange={e => handleSelectAll(e.target.checked)}
                        className="tw-sr-only"
                      />
                    </label>
                  </th>
                  <th className="tw-text-left tw-py-4 tw-px-4 tw-text-sm tw-font-semibold tw-text-gray-700 tw-align-middle">
                    프로필
                  </th>
                  <th className="tw-text-left tw-py-3 tw-px-4 tw-text-sm tw-font-semibold tw-text-gray-700 tw-align-middle">
                    이름
                  </th>
                  <th className="tw-text-left tw-py-3 tw-px-4 tw-text-sm tw-font-semibold tw-text-gray-700 tw-align-middle">
                    이메일
                  </th>
                  <th className="tw-text-left tw-py-3 tw-px-4 tw-text-sm tw-font-semibold tw-text-gray-700 tw-align-middle">
                    직군
                  </th>
                  <th className="tw-text-left tw-py-3 tw-px-4 tw-text-sm tw-font-semibold tw-text-gray-700 tw-align-middle">
                    직무
                  </th>
                </tr>
              </thead>
              <tbody>
                {professors.map((professor: ProfessorData) => (
                  <tr
                    key={professor.memberUUID}
                    className="border-bottom tw-border-gray-100 hover:tw-bg-gray-50 tw-transition-colors"
                  >
                    <td className="tw-py-3 tw-px-4 tw-text-center tw-align-middle">
                      <label className="tw-flex tw-items-center tw-justify-center tw-cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedUUIDs.includes(professor.memberUUID)}
                          onChange={e => handleCheckboxChange(professor.memberUUID, e.target.checked)}
                          className="tw-sr-only"
                        />
                        <div
                          className={`tw-w-5 tw-h-5 tw-border-2 tw-rounded tw-flex tw-items-center tw-justify-center tw-transition-all tw-duration-200 ${
                            selectedUUIDs.includes(professor.memberUUID)
                              ? 'tw-bg-blue-600 border-primary'
                              : 'tw-bg-white border hover:tw-border-blue-500'
                          }`}
                        >
                          {selectedUUIDs.includes(professor.memberUUID) && (
                            <svg className="tw-w-3 tw-h-3 tw-text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </label>
                    </td>
                    <td className="tw-py-3 tw-px-4 tw-align-middle">
                      <img
                        src={professor.profileImageUrl || '/assets/images/banner/Rectangle_193.png'}
                        alt={`${professor.nickname} 프로필`}
                        className="tw-w-8 tw-h-8 tw-rounded-full tw-object-cover tw-border-2 tw-border-gray-200"
                      />
                    </td>
                    <td className="tw-py-3 tw-px-4 tw-text-sm tw-font-medium tw-text-gray-900 tw-align-middle">
                      {professor.nickname}
                    </td>
                    <td className="tw-py-3 tw-px-4 tw-text-sm tw-text-gray-600 tw-align-middle">
                      {professor.memberId}
                    </td>
                    <td className="tw-py-3 tw-px-4 tw-align-middle">
                      <span className="tw-px-2 tw-py-1 tw-rounded tw-text-xs tw-font-semibold tw-bg-blue-100 tw-text-blue-700">
                        {professor.jobGroup.name}
                      </span>
                    </td>
                    <td className="tw-py-3 tw-px-4 tw-align-middle">
                      <span className="tw-px-2 tw-py-1 tw-rounded tw-text-xs tw-font-semibold tw-bg-gray-100 tw-text-gray-700">
                        {professor.job.name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessorList;
