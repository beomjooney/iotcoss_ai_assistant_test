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
import { useClubFavoriteList } from 'src/services/seminars/seminars.queries';
import Chip from '@mui/material/Chip';
import { jobColorKey } from 'src/config/colors';
import ClubMiniCard from 'src/stories/components/ClubMiniCard';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import useDidMountEffect from 'src/hooks/useDidMountEffect';

const cx = classNames.bind(styles);

export function MyMentorPickTemplate() {
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortType, setSortType] = useState('');
  const [params, setParams] = useState<paramProps>({ page, isJoined: '' });
  const [contents, setContents] = useState<any[]>([]);

  const { isFetched: isContentFetched } = useClubFavoriteList(params, data => {
    setContents(data.data.contents || []);
    setTotalPage(data.data.totalPage);
  });

  useDidMountEffect(() => {
    setParams({
      page,
      isJoined: sortType,
    });
  }, [sortType]);

  const handleChangeQuiz = event => {
    setSortType(event.target.value);
  };

  return (
    <div className={cx('member-edit-container')}>
      <section className={cx('content')}>
        <div className={cx('content--not-found')}>
          <Grid container direction="row" justifyContent="left" alignItems="center" rowSpacing={3}>
            <RadioGroup className="tw-items-center tw-py-5 tw-gap-3" value={sortType} onChange={handleChangeQuiz} row>
              <p className="tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d] tw-mb-1">
                정렬 :
              </p>
              <FormControlLabel
                value={''}
                control={
                  <Radio
                    sx={{
                      color: '#ced4de',
                      '&.Mui-checked': { color: '#e11837' },
                    }}
                    icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                    checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                  />
                }
                label={
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                    전체
                  </p>
                }
              />
              <FormControlLabel
                value={true}
                control={
                  <Radio
                    sx={{
                      color: '#ced4de',
                      '&.Mui-checked': { color: '#e11837' },
                    }}
                    icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                    checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                  />
                }
                label={
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                    참여중인 클럽
                  </p>
                }
              />
              <FormControlLabel
                value={false}
                control={
                  <Radio
                    sx={{
                      color: '#ced4de',
                      '&.Mui-checked': { color: '#e11837' },
                    }}
                    icon={<CheckBoxOutlineBlankRoundedIcon />} // 네모로 변경
                    checkedIcon={<CheckBoxRoundedIcon />} // 체크됐을 때 동그라미 아이콘 사용
                  />
                }
                label={
                  <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-base tw-font-bold tw-text-left tw-text-[#31343d]">
                    미참여 클럽
                  </p>
                }
              />
            </RadioGroup>
            {isContentFetched &&
              (contents.length > 0 ? (
                contents.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <ClubMiniCard
                        item={item}
                        xs={12}
                        favorite={true}
                        className={cx('reply-container__item')}
                        memberId={memberId}
                        onPostDeleteSubmit={() => {}} // Assuming a placeholder function
                      />
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="tw-text-center  tw-w-full border tw-rounded-md">
                  <div className="tw-p-10  tw-mb-5">
                    <div className="tw-p-10">즐겨찾기가 없습니다.</div>
                  </div>
                </div>
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
