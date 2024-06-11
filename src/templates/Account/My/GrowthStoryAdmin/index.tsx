import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Button from 'src/stories/components/Button';
import React, { useEffect, useState, useRef } from 'react';
import { Pagination } from 'src/stories/components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../../store/session';
import { useClubMyCommunityList } from 'src/services/seminars/seminars.queries';
import ReplyCard from 'src/stories/components/ReplyCard';
import Grid from '@mui/material/Grid';
import { jobColorKey } from 'src/config/colors';

const cx = classNames.bind(styles);

interface GrowthStoryTemplateProps {
  hasInfoData?: any;
  userType?: any;
}

export function GrowthStoryAdminTemplate({ hasInfoData, userType }: GrowthStoryTemplateProps) {
  const { memberId } = useSessionStore.getState();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any[]>([]);
  const [isTextModify, setIsTextModify] = useState(false);
  const [text, setText] = useState('');
  const textInput = useRef(null);

  const { isFetched: isContentFetched, refetch } = useClubMyCommunityList(params, data => {
    console.log(data);
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPages);
  });

  useEffect(() => {
    setParams({ page });
  }, [page]);

  const router = useRouter();

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          {isContentFetched &&
            (contents.length > 0 ? (
              contents.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <ReplyCard item={item} refetch={refetch} />
                  </React.Fragment>
                );
              })
            ) : (
              <div className="tw-text-center  tw-w-full border tw-rounded-md">
                <div className="tw-p-10  tw-mb-5">
                  <div className="tw-p-10">커뮤니티 작성글이 없습니다.</div>
                </div>
              </div>
            ))}
          <div className="tw-mt-10">
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </div>
      </section>
    </div>
  );
}
