import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState, useEffect, useCallback } from 'react';

import { MentorsModal, Pagination, ProfessorList, AdvisorList, MemberSortRadio } from 'src/stories/components';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../../store/session';
import { useProfessorCandidateList, useProfessorManageList } from 'src/services/seminars/seminars.queries';
import { useRequestAdvisors, useDeleteAdvisor } from 'src/services/seminars/seminars.mutations';

const cx = classNames.bind(styles);

export function MyAdvisorManagerTemplate() {
  const { memberId } = useSessionStore.getState();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElement, setTotalElement] = useState(1);
  const [pageCandidate, setPageCandidate] = useState(1);
  const [totalPageCandidate, setTotalPageCandidate] = useState(1);
  const [totalElementCandidate, setTotalElementCandidate] = useState(1);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any[]>([]);
  const [contentsCandidate, setContentsCandidate] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');
  const [memberSortType, setMemberSortType] = useState<string>('0100');

  // 디바운스 처리 (500ms 지연)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // 검색 키워드 변경 시 페이지 초기화
  useEffect(() => {
    if (debouncedKeyword !== '') {
      setPageCandidate(1);
    }
  }, [debouncedKeyword]);

  // 정렬 타입 변경 시 페이지 초기화
  useEffect(() => {
    setPageCandidate(1);
  }, [memberSortType]);

  useEffect(() => {
    setParams({ page });
  }, [page]);

  const { mutate: requestAdvisorsMutation, isLoading: isRequestingAdvisors } = useRequestAdvisors();
  const { mutate: deleteAdvisorMutation, isLoading: isDeletingAdvisor } = useDeleteAdvisor();

  const handleConfirmSelection = (selectedUUIDs: string[]) => {
    console.log('선택된 교수자 UUIDs:', selectedUUIDs);

    if (confirm(`선택한 ${selectedUUIDs.length}명의 교수자에게 지도 신청을 하시겠습니까?`)) {
      requestAdvisorsMutation(selectedUUIDs);
      setIsOpen(false); // 신청 후 모달 닫기
    }
  };

  const handleSearchChange = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  const handleDeleteAdvisor = useCallback(
    (memberUUID: string) => {
      deleteAdvisorMutation(memberUUID);
    },
    [deleteAdvisorMutation],
  );

  const { isFetched: isContentFetched } = useProfessorManageList(params, data => {
    setContents(data.contents || []);
    setTotalPage(data.totalPages);
    setTotalElement(data.totalElements);
  });

  const { isFetched: isContentFetchedCandidate } = useProfessorCandidateList(
    {
      page: pageCandidate,
      memberSortType,
      keyword: debouncedKeyword || undefined,
    },
    data => {
      console.log('data', data);
      setContentsCandidate(data.data.contents || []);
      setTotalPageCandidate(data.data.totalPages);
      setTotalElementCandidate(data.data.totalElements);
    },
  );

  const router = useRouter();

  return (
    <>
      <div className={cx('member-edit-container')}>
        <section className={cx('content tw-px-0 tw-pt-0')}>
          <div className="tw-flex tw-justify-between tw-items-center tw-my-4">
            <div className="tw-text-xl tw-font-bold tw-text-black tw-text-center">전체 : {totalElement}명</div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
              }}
              className="tw-bg-white border border-primary tw-text-blue-500  tw-rounded-md tw-text-sm tw-font-bold tw-py-2.5 tw-px-5 tw-rounded"
            >
              + 지도교수자 신청하기
            </button>
          </div>
          {isContentFetched && (
            <AdvisorList advisors={contents} showDeleteButton={true} onDelete={handleDeleteAdvisor} />
          )}
          <div className="tw-mt-10">
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </section>
      </div>
      <MentorsModal
        isProfile={true}
        isContentModalClick={true}
        height="680px"
        title={'지도교수자 추가하기'}
        isOpen={isOpen}
        onAfterClose={() => {
          setIsOpen(false);
          setPageCandidate(1);
          setParams({ page: 1 });
        }}
      >
        <div className="tw-h-full tw-flex tw-flex-col tw-overflow-hidden">
          <ProfessorList
            professors={contentsCandidate || []}
            onConfirmSelection={handleConfirmSelection}
            isLoading={!isContentFetchedCandidate || isRequestingAdvisors}
            searchKeyword={searchKeyword}
            onSearchChange={handleSearchChange}
            totalElement={totalElementCandidate}
            memberSortType={memberSortType}
            onSortChange={setMemberSortType}
          />
          {isContentFetchedCandidate && contentsCandidate.length > 0 && (
            <div className="tw-my-4 tw-flex tw-justify-center tw-flex-shrink-0">
              <Pagination page={pageCandidate} setPage={setPageCandidate} total={totalPageCandidate} />
            </div>
          )}
        </div>
      </MentorsModal>
    </>
  );
}
