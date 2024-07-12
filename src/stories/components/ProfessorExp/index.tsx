import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ReactModal from 'react-modal';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Toggle } from 'src/stories/components';
import CircularProgress from '@mui/material/CircularProgress';

const cx = classNames.bind(styles);
Modal.setAppElement('#__next'); // Modal 접근성 설정

const studyStatus = [
  {
    id: '0100',
    name: '아티클',
  },
  {
    id: '0200',
    name: '영상',
  },
  {
    id: '0320',
    name: '첨부파일',
  },
];

const ProfessorExpModal = ({ title, isOpen, onRequestClose, closable = true }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [value, setValue] = useState('one');
  const [contentType, setContentType] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAIQuizClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterClose={onRequestClose}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 15, 15, 0.79)',
          zIndex: 1030,
        },
        content: {
          position: 'absolute',
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1000px',
          height: '90%',
          border: '1px solid #ccc',
          background: '#fff',
          overflow: 'hidden',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '10px',
          outline: 'none',
          padding: '0px',
        },
      }}
    >
      {closable && (
        <div className="tw-flex tw-justify-between tw-items-center tw-px-5 tw-py-4 border-bottom">
          <div className={cx('closable tw-font-bold tw-text-xl tw-text-black tw-my-10 tw-mb-2 tw-text-left tw-mt-0')}>
            {title}
          </div>
          <div className={cx('closable')} onClick={onRequestClose}>
            <span className="ti-close" style={{ cursor: 'pointer' }} />
          </div>
        </div>
      )}
      <div className={cx('content tw-bg-[#fdfdff] tw-h-[90%]  tw-flex tw-flex-col tw-items-center')}>
        <Tabs
          TabIndicatorProps={{
            sx: {
              backgroundColor: 'black',
            },
          }}
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
        >
          <Tab
            value="one"
            label={
              <div>
                <span className="tw-text-lg tw-font-bold tw-normal-case">Step 1</span> <br />
                <span className="!tw-mt-5 tw-text-sm">AI 퀴즈만들기</span>
              </div>
            }
            wrapped
            sx={{
              marginRight: 4,
              '&:hover': {
                color: 'black',
              },
              '&.Mui-selected': {
                color: 'black',
              },
            }}
          />
          <Tab
            value="two"
            label={
              <div>
                <span className="tw-text-lg tw-font-bold tw-normal-case">Step 2</span> <br />
                <span className="!tw-mt-5 tw-text-sm">AI 모범답안 만들기</span>
              </div>
            }
            wrapped
            sx={{
              marginRight: 4,
              '&:hover': {
                color: 'black',
              },
              '&.Mui-selected': {
                color: 'black',
              },
            }}
          />
          <Tab
            value="three"
            label={
              <div>
                <span className="tw-text-lg tw-font-bold tw-normal-case">Step 3</span> <br />
                <span className="!tw-mt-5 tw-text-sm">AI 채점/피드백</span>
              </div>
            }
            wrapped
            sx={{
              '&:hover': {
                color: 'black',
              },
              '&.Mui-selected': {
                color: 'black',
              },
            }}
          />
        </Tabs>
        <div className="tw-w-full tw-px-20 tw-h-full tw-p-5 tw-mt-5">
          {value === 'one' && (
            <div className="tw-w-full tw-h-full">
              <Accordion
                disableGutters
                sx={{ backgroundColor: '#e9ecf2' }}
                defaultExpanded
                // expanded={expanded === 0}
                // onChange={handleChange(0)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div className="tw-flex tw-justify-between tw-items-center tw-w-full">
                    <div className="tw-text-lg tw-font-bold">지식컨텐츠 정보 입력</div>
                  </div>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: 'white', padding: 3 }}>
                  <div className="tw-text-sm tw-font-bold tw-py-2">지식컨텐츠 유형</div>
                  <div className={cx('mentoring-button__group', 'tw-px-0', 'tw-justify-center', 'tw-items-center')}>
                    {studyStatus.map((item, i) => (
                      <Toggle
                        key={item.id}
                        label={item.name}
                        name={item.name}
                        value={item.id}
                        variant="small"
                        checked={contentType === item.id}
                        isActive
                        type="tabButton"
                        onChange={() => {
                          setContentType(item.id);
                        }}
                        className={cx('tw-mr-2 !tw-w-[90px]')}
                      />
                    ))}
                  </div>

                  <div>
                    <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 URL</div>
                    <TextField
                      required
                      disabled
                      value={contentUrl}
                      onChange={e => setContentUrl(e.target.value)}
                      id="username"
                      name="username"
                      variant="outlined"
                      type="search"
                      size="small"
                      fullWidth
                      sx={{
                        '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                      }}
                    />
                  </div>

                  <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">지식컨텐츠 제목</div>
                  <TextField
                    required
                    id="username"
                    value={contentTitle}
                    onChange={e => setContentTitle(e.target.value)}
                    name="username"
                    disabled
                    variant="outlined"
                    type="search"
                    size="small"
                    fullWidth
                    sx={{
                      '& label': { fontSize: 15, color: '#919191', fontWeight: 'light' },
                    }}
                  />

                  <div className="tw-text-sm tw-font-bold tw-pt-5 tw-pb-3">퀴즈만들기</div>
                  <button
                    disabled={isLoading} // 로딩 중일 때 버튼 비활성화
                    onClick={handleAIQuizClick}
                    className="tw-w-[120px] tw-mt-1 tw-col-span-1 tw-px-2 tw-py-3 tw-text-sm tw-bg-[#313B49] tw-rounded tw-text-white"
                  >
                    {isLoading ? <CircularProgress size={20} /> : '퀴즈 생성하기'}
                  </button>
                </AccordionDetails>
              </Accordion>
              <div className="tw-flex tw-justify-end tw-items-center tw-w-full tw-mt-3">
                <button
                  onClick={() => {
                    setValue('two');
                  }}
                  className="tw-w-[120px] tw-mt-1 tw-px-2 tw-py-3 tw-text-sm  tw-bg-[#313B49] tw-rounded tw-text-white"
                >
                  다음
                </button>
              </div>
            </div>
          )}
          {value === 'two' && <div>Step 2</div>}
          {value === 'three' && <div>Step 3</div>}
        </div>
      </div>
    </ReactModal>
  );
};

export default ProfessorExpModal;
