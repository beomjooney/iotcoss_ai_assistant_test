import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useState } from 'react';
import { useSessionStore } from 'src/store/session';
import { useMemberActiveSummaryInfo } from 'src/services/account/account.queries';
import { useQuizActivityHistory } from 'src/services/quiz/quiz.queries';
import { useEffect } from 'react';
import { Button } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { pink } from '@mui/material/colors';

const cx = classNames.bind(styles);

const useStyles = makeStyles({
  checkbox: {
    color: '#000000',
    '&.Mui-checked': {
      color: '#2474ED',
    },
  },
});

export function MyCompanyProfileEditTemplate() {
  const classes = useStyles();
  const { memberId } = useSessionStore.getState();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [params, setParams] = useState<any>({ page });
  const [contents, setContents] = useState<any>([]);

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    quizClub: false,
    learnerAnalysis: false,
    representativeQuiz: false,
    allQuiz: false,
  });

  const [checkedItems, setCheckedItems] = useState({
    consent: false,
    basic: true,
    quizClub: true,
    learnerAnalysis: false,
    representativeQuiz: false,
    allQuiz: false,
  });

  const sharedItems = [
    {
      key: 'basic',
      title: '기본항목',
      items: ['이름', '대학', '학과'],
    },
    {
      key: 'quizClub',
      title: '퀴즈클럽 요약',
      items: ['퀴즈클럽 활동 요약 정보'],
    },
    {
      key: 'learnerAnalysis',
      title: '학습자 분석 요약',
      items: ['학습자 분석 요약 정보'],
    },
    {
      key: 'representativeQuiz',
      title: '대표 퀴즈 답변',
      items: ['대표 퀴즈 답변 정보'],
    },
    {
      key: 'allQuiz',
      title: '전체 퀴즈 답변',
      items: ['전체 퀴즈 답변 정보'],
    },
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCheckbox = (item: keyof typeof checkedItems) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const [summary, setSummary] = useState({});
  const { isFetched: isUserFetched } = useMemberActiveSummaryInfo(data => setSummary(data));

  const { isFetched: isContentFetched, refetch: refetch } = useQuizActivityHistory(params, data => {
    console.log(data);
    setContents(data);
    setTotalPage(data?.totalPage);
    setPage(data?.page);
  });

  useEffect(() => {
    setParams({
      page,
    });
  }, [page]);

  return (
    <div className={cx('member-edit-container')}>
      <div className={cx('content--not-found')}>
        <div className="tw-min-h-screen tw-bg-background tw-px-0 tw-py-4">
          <div className="tw-space-y-6">
            {/* Header */}
            <div className="tw-flex tw-items-center tw-justify-between">
              <div className="tw-text-xl tw-font-bold tw-text-black">약관동의 내역</div>
              <Button variant="outlined" size="large">
                정보수정
              </Button>
            </div>

            {/* Information Box */}
            <div className="tw-rounded-lg border tw-p-6">
              <div className="tw-space-y-3 tw-text-base tw-leading-relaxed tw-text-black">
                <p>학습자의 퀴즈클럽 학습 결과와 평가 내용은 교수님의 추천을 통해 기업에 공유될 수 있습니다.</p>
                동의하시면 실제 채용 기회나 실무 연계 프로젝트에 우선 추천될 수 있습니다. 동의하지 않으면 본 명의 의료
                절대 사용되지 않습니다. <br /> 교수님께서 희망날짜 기간에 추천할 때 필요한 학습 결과 제공에
                동의하시겠습니까?
              </div>
            </div>

            {/* Checkbox Option */}
            <div className="tw-flex tw-items-start tw-gap-3">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedItems.consent}
                    onChange={() => toggleCheckbox('consent')}
                    classes={{ root: classes.checkbox }}
                  />
                }
                label="기업체 학습자 학습내역 정보 공유동의 (선택)"
                className="tw-text-sm tw-font-normal tw-text-black"
              />
            </div>

            {/* Shared Items Section */}
            <div className="tw-space-y-4">
              <div className="tw-text-xl tw-font-bold tw-text-black">공유 항목</div>

              {sharedItems.map(item => (
                <div key={item.key} className="">
                  <button
                    onClick={() => toggleSection(item.key as keyof typeof expandedSections)}
                    className="tw-rounded-lg tw-bg-[#F6F7FB] tw-flex tw-w-full tw-items-center tw-justify-between tw-p-4 tw-text-left tw-transition-colors tw-hover:tw-bg-accent"
                  >
                    <div className="tw-flex tw-items-center tw-gap-3">
                      <Checkbox
                        checked={checkedItems[item.key as keyof typeof checkedItems]}
                        onChange={() => toggleCheckbox(item.key as keyof typeof checkedItems)}
                        onClick={e => e.stopPropagation()}
                        classes={{ root: classes.checkbox }}
                      />
                      <span className="tw-font-medium tw-text-black">{item.title}</span>
                    </div>
                    {expandedSections[item.key as keyof typeof expandedSections] ? (
                      <ExpandLess className="tw-h-5 tw-w-5 tw-text-muted-foreground" />
                    ) : (
                      <ExpandMore className="tw-h-5 tw-w-5 tw-text-muted-foreground" />
                    )}
                  </button>
                  {expandedSections[item.key as keyof typeof expandedSections] && (
                    <div className="tw-border-t tw-border-border tw-bg-muted/30 tw-px-4 tw-py-6">
                      {item.key === 'basic' ? (
                        <ul className="tw-space-y-2 tw-text-base tw-text-black tw-ml-14">
                          {item.items.map((subItem, index) => (
                            <li key={index}>{subItem}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="tw-text-base tw-text-black tw-ml-14">{item.items[0]}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
