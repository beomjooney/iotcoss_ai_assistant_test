import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import ClubMiniCard from 'src/stories/components/ClubMiniCard';
import { Pagination } from 'src/stories/components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../../store/session';
import { useClubWaitingList } from 'src/services/seminars/seminars.queries';
import Grid from '@mui/material/Grid';
import { jobColorKey } from 'src/config/colors';

const cx = classNames.bind(styles);

interface GrowthStoryTemplateProps {
  hasInfoData?: any;
  userType?: any;
}

export function GrowthStoryTemplate({ hasInfoData, userType }: GrowthStoryTemplateProps) {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<any[]>([]);

  const { isFetched: isContentFetched } = useClubWaitingList(params, data => {
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPage);
  });

  const router = useRouter();

  return (
    <>
      <div className={cx('member-edit-container')}>
        <section className={cx('content tw-px-0 tw-pt-0')}>
          {isContentFetched &&
            (contents.length > 0 ? (
              contents.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <div className="tw-pb-4">
                      <div className="tw-pb-2 tw-text-base tw-font-medium tw-text-black">
                        신청일 : {item.startAt.split(' ')[0]}
                      </div>
                      <ClubMiniCard
                        favorite={true}
                        item={item}
                        xs={12}
                        className={cx('reply-container__item')}
                        // onPostDeleteSubmit={onPostDeleteSubmit}
                      />
                    </div>
                  </React.Fragment>
                );
              })
            ) : (
              <div className="tw-text-center  tw-w-full border tw-rounded-md">
                <div className="tw-p-10  tw-mb-5">
                  <div className="tw-p-10">가입 승인 대기 중인 클럽이 없습니다.</div>
                  <button
                    onClick={() => {
                      location.href = '/quiz';
                      localStorage.setItem('activeIndex', '1');
                    }}
                    className="tw-mr-2 tw-bg-[#2474ED] tw-rounded-md border tw-text-sm tw-text-white tw-font-bold tw-py-2.5 tw-px-5 tw-rounded"
                  >
                    클럽 가입하러가기
                  </button>
                </div>
              </div>
            ))}
          <div className="tw-mt-10">
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </section>
      </div>
    </>
  );
}
