import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Button from 'src/stories/components/Button';
import React, { useState } from 'react';
import { Chip, ClubCard, Pagination, Typography } from 'src/stories/components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../../../store/session';
import { useSeminarList, useSeminarMeList, useSeminarMeWaitList } from 'src/services/seminars/seminars.queries';
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
  const [params, setParams] = useState<paramProps>({ page, status: '0002' });
  const [contents, setContents] = useState<RecommendContent[]>([]);

  const { isFetched: isContentFetched } = useSeminarMeWaitList(params, data => {
    console.log('quiz club : ', data.data.contents);
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPage);
  });

  const router = useRouter();

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
