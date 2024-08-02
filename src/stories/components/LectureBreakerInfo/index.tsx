import React from 'react';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { useState, useRef } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { makeStyles } from '@mui/styles';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const useStyles = makeStyles(theme => ({
  selected: {
    '&&': {
      backgroundColor: '#000',
      color: 'white',
    },
  },
}));

const LectureBreakerInfo = ({
  avatarSrc = '',
  userName = 'Unknown User',
  publishDate,
  dayOfWeek,
  questionText,
  isPublished,
  index,
  answerText,
  knowledgeContentTitle = '[영상] CircuitBreaker를 이용한 외부 API 장애 관리',
  handleCheckboxDelete,
  handleAddClick,
}) => {
  const [isPublic, setIsPublic] = useState('0001');
  const [clubName, setClubName] = useState('');
  const [participationCode, setParticipationCode] = useState('');
  const [inputList, setInputList] = useState([]);
  const [fileList, setFileList] = useState([]);

  const handleInputChange = e => {
    setClubName(e.target.value);
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.pdf)$/i;

    if (!allowedExtensions.exec(file.name)) {
      alert('허용되지 않는 파일 형식입니다.');
      event.target.value = ''; // input 초기화
      return;
    }

    setFileList([file]); // 하나의 파일만 받도록 설정
  };

  const handleIsPublic = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    setIsPublic(newFormats);
    console.log(newFormats);
    if (newFormats === '0002') {
      setIsPublic('0002');
    }
  };

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleAddInput = () => {
    setInputList([...inputList, { id: Date.now(), value: '', url: '' }]);
  };

  const handleDeleteInput = id => {
    setInputList(inputList.filter(input => input.id !== id));
  };

  const classes = useStyles();

  return (
    <div className="tw-mb-1">
      {/* <Grid container direction="row" justifyContent="left" alignItems="center" rowSpacing={4}>
        <Grid item xs={1}>
          <div className=" tw-text-center tw-text-black tw-font-bold">Q{index + 1}.</div>
          <div className="tw-text-center tw-text-sm tw-text-black tw-font-bold">
            {publishDate.slice(5, 10)} ({dayOfWeek})
          </div>
        </Grid> */}
      {/* <Grid item xs={11}> */}
      {index === null ? (
        <div>
          <div className="tw-relative tw-overflow-visible tw-rounded-lg tw-bg-[#f6f7fb] tw-mb-3 tw-h-20 tw-z-10">
            <div className="tw-flex tw-justify-center tw-items-center tw-h-full tw-gap-2 tw-px-5">
              <TextField
                size="small"
                fullWidth
                onChange={handleInputChange}
                id="margin-none"
                value={clubName}
                name="clubName"
                placeholder="강의제목을 입력해주세요."
                sx={{ backgroundColor: 'white', marginRight: '30px' }}
              />
              <div className="tw-flex tw-items-center tw-justify-center">
                <svg
                  width={28}
                  height={28}
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tw-mr-3 tw-w-7 tw-h-7"
                  preserveAspectRatio="none"
                >
                  <rect x="0.5" y="0.5" width={27} height={27} rx="3.5" stroke="#31343D" />
                  <path d="M6 10H22" stroke="#31343D" strokeWidth="1.5" />
                  <path d="M6 14H22" stroke="#31343D" strokeWidth="1.5" />
                  <path d="M6 18H22" stroke="#31343D" strokeWidth="1.5" />
                </svg>

                <svg
                  onClick={e => {
                    e.stopPropagation(); // Prevent drag event
                    handleCheckboxDelete(index);
                    console.log(index);
                  }}
                  width={28}
                  height={28}
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="tw-cursor-pointer tw-w-7 tw-h-7"
                  preserveAspectRatio="none"
                >
                  <rect width={28} height={28} rx={4} fill="#31343D" />
                  <path d="M20 8L8 20" stroke="white" strokeWidth="1.5" />
                  <path d="M8 8L20 20" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <div className=" tw-flex tw-items-center tw-justify-center tw-my-3 tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border border-[#e9ecf2]">
            <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
              <div className="tw-w-1/12 tw-flex tw-justify-center tw-items-center">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 relative"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                    stroke="#9CA5B2"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="tw-w-11/12 tw-py-5">
                <div className="tw-w-full tw-flex tw-justify-start tw-items-center">
                  <div className="tw-flex tw-text-black tw-text-base tw-w-[140px]">강의유형 설정 : </div>
                  <div className="tw-flex tw-items-center tw-gap-2 tw-w-full tw-px-5">
                    <ToggleButtonGroup value={isPublic} onChange={handleIsPublic} exclusive aria-label="">
                      <ToggleButton
                        classes={{ selected: classes.selected }}
                        value="0001"
                        className="tw-ring-1 tw-ring-slate-900/10"
                        style={{
                          width: 70,
                          borderRadius: '5px',
                          borderLeft: '0px',
                          margin: '5px',
                          height: '35px',
                          border: '0px',
                        }}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#000',
                            color: '#fff',
                          },
                        }}
                      >
                        공개
                      </ToggleButton>
                      <ToggleButton
                        classes={{ selected: classes.selected }}
                        value="0002"
                        className="tw-ring-1 tw-ring-slate-900/10"
                        style={{
                          width: 70,
                          borderRadius: '5px',
                          borderLeft: '0px',
                          margin: '5px',
                          height: '35px',
                          border: '0px',
                        }}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#000',
                            color: '#fff',
                          },
                        }}
                      >
                        비공개
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <TextField
                      fullWidth
                      className="tw-pl-1"
                      size="small"
                      value={participationCode}
                      onChange={e => setParticipationCode(e.target.value)}
                      placeholder="온라인 강의 URL을 입력해주세요."
                      id="margin-none"
                    />
                  </div>
                </div>
                <div className="tw-mt-3 tw-w-full tw-flex tw-justify-start tw-items-center">
                  <div className="tw-flex tw-text-black tw-text-base tw-w-[140px]">강의자료 업로드 : </div>
                  <div className="tw-flex tw-items-center tw-gap-2 tw-w-full tw-px-5">
                    <div className="tw-w-[160px] tw-flex tw-items-center tw-gap-2 border tw-px-2 tw-py-2.5 tw-rounded">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 absolute left-0 top-0.5"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g clipPath="url(#clip0_679_9101)">
                          <path
                            d="M2.61042 6.86336C2.55955 6.9152 2.49887 6.95638 2.4319 6.98449C2.36494 7.01259 2.29304 7.02707 2.22042 7.02707C2.14779 7.02707 2.0759 7.01259 2.00894 6.98449C1.94197 6.95638 1.88128 6.9152 1.83042 6.86336C1.72689 6.75804 1.66887 6.61625 1.66887 6.46856C1.66887 6.32087 1.72689 6.17909 1.83042 6.07376L6.65522 1.20016C7.74322 0.355364 8.83762 -0.050236 9.92722 0.00496403C11.3 0.075364 12.3688 0.598564 13.276 1.45696C14.2008 2.33216 14.7992 3.58096 14.7992 5.09456C14.7992 6.25616 14.4616 7.27856 13.7488 8.18576L6.94642 15.1938C6.25842 15.7578 5.49362 16.0306 4.67442 15.9978C3.63442 15.9546 2.86082 15.6186 2.28562 15.0498C1.61202 14.385 1.19922 13.5682 1.19922 12.4698C1.19922 11.5962 1.50082 10.7898 2.12322 10.033L8.11042 3.92016C8.59042 3.40816 9.06002 3.10416 9.54002 3.03056C9.86039 2.9801 10.1883 3.00876 10.495 3.11403C10.8018 3.21931 11.0781 3.39801 11.3 3.63456C11.7256 4.08496 11.908 4.64656 11.844 5.28576C11.8 5.72176 11.6216 6.12336 11.2936 6.50816L5.78962 12.1466C5.73909 12.1986 5.6787 12.24 5.61198 12.2685C5.54527 12.2969 5.47355 12.3118 5.40102 12.3123C5.3285 12.3127 5.25661 12.2987 5.18954 12.2711C5.12248 12.2435 5.06159 12.2028 5.01042 12.1514C4.90625 12.0467 4.84737 11.9052 4.84647 11.7575C4.84557 11.6099 4.90273 11.4677 5.00562 11.3618L10.4832 5.75216C10.6432 5.56416 10.7272 5.37456 10.7472 5.17296C10.7792 4.85296 10.7024 4.61696 10.5032 4.40656C10.4026 4.29881 10.2769 4.21759 10.1374 4.17014C9.99779 4.12268 9.84865 4.11046 9.70322 4.13456C9.50882 4.16416 9.23682 4.34096 8.90162 4.69776L2.93922 10.7834C2.50962 11.3074 2.30162 11.8634 2.30162 12.4706C2.30162 13.2338 2.57762 13.7802 3.05522 14.2514C3.43522 14.6274 3.95122 14.8514 4.71922 14.8834C5.26322 14.905 5.76722 14.725 6.20562 14.3698L12.9232 7.44976C13.4392 6.78816 13.6968 6.00976 13.6968 5.09536C13.6968 3.90976 13.2352 2.94816 12.5224 2.27296C11.7944 1.58336 10.9624 1.17696 9.87202 1.12096C9.06562 1.07936 8.22002 1.39296 7.37842 2.03776L2.61042 6.86336Z"
                            fill="#31343D"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_679_9101">
                            <rect width={16} height={16} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <button className=" tw-text-sm tw-text-left tw-text-[#31343d]" onClick={handleButtonClick}>
                        파일 업로드 +
                      </button>
                      <input
                        accept=".pdf"
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                    </div>
                    <TextField
                      fullWidth
                      className="tw-pl-1"
                      size="small"
                      value={participationCode}
                      onChange={e => setParticipationCode(e.target.value)}
                      placeholder="강의자료 URL을 입력해주세요."
                      id="margin-none"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleAddInput}>
                              <AddIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </div>
                <div className="tw-mt-3 tw-w-full tw-flex tw-justify-end tw-px-5 tw-items-center">
                  {inputList.length > 0 && (
                    <div className="tw-flex  tw-py-2 tw-w-[664px]">
                      <div className="tw-flex-1 tw-text-left tw-pl-5">
                        {inputList.map((input, index) => (
                          <div key={input.id} style={{ marginBottom: '10px' }}>
                            <div className="tw-flex tw-items-center tw-gap-2">
                              <TextField
                                fullWidth
                                className="tw-pl-1"
                                size="small"
                                value={participationCode}
                                placeholder="강의자료 URL을 입력해주세요."
                                onChange={event => handleInputChange(input.id, event)}
                                id="margin-none"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton onClick={handleAddInput}>
                                        <AddIcon />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              {/* <input
                                type="text"
                                className="border tw-w-full tw-rounded tw-text-sm tw-p-2"
                                value={input.url}
                                placeholder="http://"

                              /> */}
                              <button
                                className="tw-text-white tw-bg-black tw-rounded tw-w-[60px] tw-py-2 tw-ml-2"
                                onClick={() => handleDeleteInput(input.id)}
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className=" tw-relative tw-overflow-visible tw-rounded-lg tw-bg-[#f6f7fb] tw-mb-3 tw-grid tw-grid-cols-[60px_1fr_100px_28px_40px] tw-grid-rows-[auto_auto] tw-h-20 tw-z-10">
            <img
              src={avatarSrc}
              alt="User Avatar"
              className="tw-w-8 border tw-h-8 tw-col-start-1 tw-row-start-1 tw-row-end-2 tw-mt-[11px] tw-ml-[22px] tw-rounded-full tw-object-cover"
            />
            <p className="tw-col-start-1 tw-row-start-2 tw-row-end-3 tw-mt-[2px] tw-ml-[22px] tw-text-[10px] tw-text-left tw-text-black">
              {userName}
            </p>
            <p
              className={`tw-col-start-2 tw-col-end-3 tw-row-start-1 tw-row-end-3 tw-text-base tw-text-left  tw-ml-[33px] tw-flex tw-items-center ${
                isPublished ? 'tw-text-black' : 'tw-text-gray-400'
              }`}
            >
              {questionText}
            </p>
            <svg
              width={28}
              height={28}
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-mr-5 tw-w-7 tw-h-7 tw-col-start-5 tw-row-start-1 tw-row-end-3 tw-place-self-center"
              preserveAspectRatio="none"
            >
              <rect x="0.5" y="0.5" width={27} height={27} rx="3.5" stroke="#31343D" />
              <path d="M6 10H22" stroke="#31343D" strokeWidth="1.5" />
              <path d="M6 14H22" stroke="#31343D" strokeWidth="1.5" />
              <path d="M6 18H22" stroke="#31343D" strokeWidth="1.5" />
            </svg>
            {!isPublished && (
              <svg
                onClick={e => {
                  e.stopPropagation(); // Prevent drag event
                  handleCheckboxDelete(index);
                  console.log(index);
                }}
                width={28}
                height={28}
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-cursor-pointer tw-mr-5 tw-w-7 tw-h-7 tw-col-start-4 tw-row-start-1 tw-row-end-3 tw-place-self-center"
                preserveAspectRatio="none"
              >
                <rect width={28} height={28} rx={4} fill="#31343D" />
                <path d="M20 8L8 20" stroke="white" strokeWidth="1.5" />
                <path d="M8 8L20 20" stroke="white" strokeWidth="1.5" />
              </svg>
            )}
          </div>
          <div className="tw-my-3 tw-h-[137px] tw-mb-4 tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white border border-[#e9ecf2]">
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-w-6 tw-h-6 tw-absolute tw-left-4 tw-top-4"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M6 4V11.3362C6 12.309 6.29176 13.242 6.81109 13.9299C7.33042 14.6178 8.03479 15.0043 8.76923 15.0043H18M18 15.0043L14.3077 10.1135M18 15.0043L14.3077 19.8951"
                stroke="#9CA5B2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="tw-absolute tw-left-[52px] tw-top-[19px] tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
              모범답안 :
            </p>
            <p className="tw-pr-5 tw-line-clamp-3 tw-absolute tw-left-[119px] tw-top-[19px] tw-text-sm tw-text-left tw-text-[#31343d]">
              {answerText}
            </p>
            <div className="tw-py-2 tw-flex tw-justify-start tw-items-start tw-absolute tw-left-[52px] tw-top-[73px] tw-gap-3">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#31343d]">지식컨텐츠</p>
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#9ca5b2]">
                {knowledgeContentTitle}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* </Grid> */}
      {/* </Grid> */}
    </div>
  );
};

export default LectureBreakerInfo;
