import classNames from 'classnames/bind';
import styles from './index.module.scss';
import MentorPick from 'src/stories/components/MentorPick';
import Button from 'src/stories/components/Button';
import { useMyMentorList } from 'src/services/mentors/mentors.queries';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import Link from 'next/link';
import Pagination from 'src/stories/components/Pagination';
import Grid from '@mui/material/Grid';
import { useSeminarMeFavoriteList } from 'src/services/seminars/seminars.queries';
import Chip from '@mui/material/Chip';
import { jobColorKey } from 'src/config/colors';
import ClubCard from 'src/stories/components/ClubCard';

const cx = classNames.bind(styles);

export function MyMentorPickTemplate() {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<paramProps>({ page });
  const [contents, setContents] = useState<RecommendContent[]>([]);

  const { isFetched: isContentFetched } = useSeminarMeFavoriteList(params, data => {
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPage);
  });

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          <Grid container direction="row" justifyContent="left" alignItems="center" rowSpacing={3}>
            {isContentFetched &&
              (contents.length > 0 ? (
                contents.map((item, index) => {
                  return (
                    <ClubCard
                      key={index}
                      item={item}
                      xs={12}
                      // writer={memberSample}
                      className={cx('reply-container__item')}
                      // memberId={memberId}
                      // onPostDeleteSubmit={onPostDeleteSubmit}
                    />
                  );
                })
              ) : (
                <div className={cx('content--empty')}>데이터가 없습니다.</div>
              ))}
          </Grid>
          <div className="tw-mt-10">
            <Pagination page={page} setPage={setPage} total={totalPage} />
          </div>
        </div>
      </section>
    </div>
  );
}
