import classNames from 'classnames/bind';
import styles from './index.module.scss';
import MentorPick from 'src/stories/components/MentorPick';
import Button from 'src/stories/components/Button';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import Link from 'next/link';
import { useMySeminarList } from 'src/services/seminars/seminars.queries';
import { ArticleEnum } from '../../../../config/types';
import ArticleCard from '../../../../stories/components/ArticleCard';
import Grid from '@mui/material/Grid';

const cx = classNames.bind(styles);

export function SeminarApplicationDetailTemplate() {
  const { data } = useMySeminarList();

  return (
    <article className={cx('seminar-application-detal-container')}>
      <section className={cx('seminar-area')}>
        <Grid container spacing={{ xs: 1.5, md: 1.5, sm: 1.5 }} columns={{ xs: 12, sm: 12, md: 12 }}>
          {data?.length === 0
            ? '데이터가 없습니다.'
            : data?.map((item, i) => (
                <Grid item xs={6} sm={6} md={4} key={i}>
                  <ArticleCard
                    uiType={ArticleEnum.MENTOR_SEMINAR}
                    content={item}
                    key={i}
                    mdSize="col-md-6"
                    className={cx('container__item')}
                  />
                </Grid>
              ))}
        </Grid>
      </section>
      <div className={cx('button-area')}>
        <Link href={`/seminar`}>
          <Button type="button" color="primary" size="my-page">
            모든 세미나 보러가기 &gt;
          </Button>
        </Link>
      </div>
    </article>
  );
}
