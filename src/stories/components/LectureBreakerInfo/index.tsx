import React from 'react';
import { useState, useRef } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { makeStyles } from '@mui/styles';
import { TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import validator from 'validator';

const useStyles = makeStyles(theme => ({
  selected: {
    '&&': {
      backgroundColor: '#000',
      color: 'white',
    },
  },
}));

const LectureBreakerInfo = ({
  // avatarSrc = '',
  userName = 'Unknown User',
  publishDate,
  dayOfWeek,
  questionText,
  isPublished,
  order,
  answerText,
  knowledgeContentTitle = '[영상] CircuitBreaker를 이용한 외부 API 장애 관리',
  handleRemoveInput,
  handleCheckboxDelete,
  scheduleUrlAdd,
  urlList,
  handleAddClick,
  scheduleFileAdd,
  handleRemoveFile,
  fileList,
  lectureNameChange,
  lectureNameUrl,
  handleTypeChange,
  handleUrlChange,
  handleStartDayChange,
  handleEndDayChange,
  onFileDownload,
  onMouseDown,
  onTouchStart,
  isProcessing,
  item,
}) => {
  // const [isPublic, setIsPublic] = useState('0100');
  // const [onlineUrl, setOnlineUrl] = useState('');
  const [input, setInput] = useState('');
  const [inputList, setInputList] = useState([]);

  const onChangeHandleFromToStartDate = date => {
    if (date) {
      // Convert date to a Dayjs object
      const formattedDate = dayjs(date);
      // Format the date as 'YYYY-MM-DD'
      const formattedDateString = formattedDate.format('YYYY-MM-DD');
      // Set both today and todayEnd
      handleStartDayChange(order, formattedDateString);
    }
  };
  const onChangeHandleFromToEndDate = date => {
    if (date) {
      // Convert date to a Dayjs object
      const formattedDate = dayjs(date);
      // Format the date as 'YYYY-MM-DD'
      const formattedDateString = formattedDate.format('YYYY-MM-DD');
      // Set both today and todayEnd
      handleEndDayChange(order, formattedDateString);
    }
  };

  const handleInputChange = (order, e) => {
    lectureNameChange(order, e.target.value);
  };
  const handleInputUrlChange = (order, e: any, serialNumber: boolean, indexs: number) => {
    lectureNameUrl(order, e.target.value, serialNumber, indexs);
  };
  const handleInputOnlineUrlChange = (order, e) => {
    handleUrlChange(order, e.target.value);
  };

  const handleFileChange = (event, order) => {
    console.log('files', event.target.files);
    const files = Array.from(event.target.files);
    const allowedExtensions = /(\.pdf)$/i;
    const maxFileSize = 50 * 1024 * 1024; // 50MB in bytes

    for (let i = 0; i < files.length; i++) {
      if (!allowedExtensions.exec(files[i].name)) {
        alert('허용되지 않는 파일 형식입니다.');
        event.target.value = ''; // input 초기화
        return;
      }

      if (files[i].size > maxFileSize) {
        alert('파일 크기는 50MB를 초과할 수 없습니다.');
        event.target.value = ''; // input 초기화
        return;
      }
    }

    scheduleFileAdd(order, files);
    // 동일 파일 업로드를 허용하기 위해 input 초기화
    event.target.value = '';
  };

  const handleIsPublic = (event: React.MouseEvent<HTMLElement>, newFormats: string) => {
    if (newFormats !== null) {
      handleTypeChange(order, newFormats);
    }
  };

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleAddInput = index => {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      alert('URL은 http:// 또는 https://로 시작해야 합니다.');
      return;
    }

    if (!validator.isURL(input)) {
      // setErrorMessage('Is Valid URL');
      alert('올바른 URL을 입력해주세요.');
      return;
    }

    if (input !== '') {
      scheduleUrlAdd(order, input);
      setInputList([...inputList, input]); // Add current input to the list
      setInput(''); // Clear the input field after adding
    }
  };

  const handleDeleteInput = id => {
    console.log(order);
    handleRemoveInput(order, id);
    // setInputList(inputList.filter((_, i) => i !== id));
  };

  const classes = useStyles();

  return (
    <div className="tw-mb-1">
      <div>
        <div className="tw-relative tw-overflow-visible tw-rounded-lg tw-bg-[#f6f7fb] tw-mb-3 tw-h-20 tw-z-10">
          <div className="tw-flex tw-justify-center tw-items-center tw-h-full tw-gap-2 tw-px-5">
            <TextField
              size="small"
              fullWidth
              onChange={e => handleInputChange(order, e)}
              id="margin-none"
              value={item.clubStudyName}
              name="clubName"
              placeholder="강의제목을 입력해주세요."
              onDragStart={e => e.preventDefault()} // Prevent default drag behavior on TextField
              sx={{ backgroundColor: 'white', marginRight: '30px' }}
            />
            <div className="tw-flex tw-items-center tw-justify-center">
              <svg
                width={28}
                height={28}
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-mr-3 tw-w-7 tw-h-7 tw-cursor-pointer"
                preserveAspectRatio="none"
                onTouchStart={e => {
                  e.preventDefault();
                  console.log('touchStart');
                  e.target.style.backgroundColor = 'blue';
                  // document.body.style.overflow = 'hidden';
                  onTouchStart(e);
                }}
              >
                <rect x="0.5" y="0.5" width={27} height={27} rx="3.5" stroke="#31343D" />
                <path d="M6 10H22" stroke="#31343D" strokeWidth="1.5" />
                <path d="M6 14H22" stroke="#31343D" strokeWidth="1.5" />
                <path d="M6 18H22" stroke="#31343D" strokeWidth="1.5" />
              </svg>
              <svg
                onClick={e => {
                  e.stopPropagation(); // Prevent drag event
                  handleCheckboxDelete(order);
                  console.log(order);
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
        <div className="tw-h-[315px] tw-flex tw-items-start tw-justify-center tw-my-3 tw-relative tw-overflow-y-auto tw-rounded-lg tw-bg-white border border-[#e9ecf2]">
          <div className="tw-w-full tw-flex tw-justify-between tw-items-start">
            <div className="tw-w-1/12 tw-flex tw-justify-center tw-items-center tw-mt-7">
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
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="tw-w-11/12 tw-py-5">
              <div className="tw-w-full tw-flex tw-justify-start tw-items-center">
                <div className="tw-flex tw-text-black tw-text-base tw-w-[120px] tw-line-clamp-1">강의유형 설정 : </div>
                <div className="tw-flex tw-items-center tw-gap-1 tw-w-full tw-px-4">
                  <ToggleButtonGroup value={item.clubStudyType} onChange={handleIsPublic} exclusive aria-label="">
                    <ToggleButton
                      classes={{ selected: classes.selected }}
                      value="0100"
                      className="tw-ring-1 tw-ring-slate-900/10"
                      style={{
                        width: 80,
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
                      오프라인
                    </ToggleButton>

                    <ToggleButton
                      classes={{ selected: classes.selected }}
                      value="0200"
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
                      <span className="tw-w-full">온라인</span>
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Tooltip title="학습자 대시보드에서 해당 URL로 바로 이동 가능합니다." disableInteractive>
                    <TextField
                      fullWidth
                      className="tw-pl-1"
                      size="small"
                      value={item.clubStudyUrl}
                      disabled={item.clubStudyType === '0100'}
                      onChange={e => handleInputOnlineUrlChange(order, e)}
                      placeholder="온라인 강의 URL을 입력해주세요."
                      id="margin-none"
                    />
                  </Tooltip>
                  <div className="tw-flex tw-items-center">
                    <div className="tw-text-black tw-text-base tw-pl-2  tw-w-[60px]">시작일:</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="YYYY-MM-DD"
                        slotProps={{
                          textField: {
                            size: 'small',
                            style: { backgroundColor: 'white', width: '150px' },
                          },
                        }}
                        value={dayjs(item?.startDate)}
                        onChange={e => onChangeHandleFromToStartDate(e)}
                      />
                    </LocalizationProvider>
                    <div className=" tw-text-black tw-text-base tw-pl-2 tw-w-[60px]">종료일:</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="YYYY-MM-DD"
                        slotProps={{
                          textField: { size: 'small', style: { backgroundColor: 'white', width: '150px' } },
                        }}
                        value={dayjs(item?.endDate)}
                        onChange={e => onChangeHandleFromToEndDate(e)}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <div className="tw-mt-3 tw-w-full tw-flex tw-justify-start tw-items-center">
                <div className="tw-flex tw-text-black tw-text-base tw-w-[120px]">강의자료 업로드 :</div>
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
                    <button
                      className=" tw-text-sm tw-text-center tw-text-[#31343d] tw-w-[90px]"
                      onClick={handleButtonClick}
                    >
                      파일 업로드 +
                    </button>
                    <input
                      multiple
                      accept=".pdf,.ppt,.pptx"
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={e => {
                        handleFileChange(e, order);
                      }}
                    />
                  </div>
                  <Tooltip title="현재 강의영상은 유튜브만 지원하고 있습니다." disableInteractive>
                    <TextField
                      fullWidth
                      className="tw-pl-1"
                      size="small"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="강의영상 유튜브 URL을 입력해주세요. https://www.youtube.com/"
                      id="margin-none"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => handleAddInput(order)}>
                              <AddIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
              <div className="tw-flex">
                <div className="tw-w-[130px] tw-py-5"></div>
                <div className="tw-w-11/12 tw-pt-5">
                  <div className="tw-w-full tw-flex tw-justify-start tw-px-5 tw-items-center">
                    {fileList?.length > 0 && (
                      <div className="tw-flex tw-py-2">
                        <div className="tw-flex tw-text-sm tw-items-start tw-mt-1" style={{ minWidth: '6.1rem' }}>
                          업로드된 파일 :
                        </div>
                        <div className="tw-text-left tw-pl-5 tw-text-sm tw-flex-col tw-gap-5">
                          {fileList.map((file, index) => (
                            <div key={index}>
                              <div className="tw-flex tw-items-center tw-gap-3 tw-pb-2">
                                <div className="border tw-px-3 tw-p-1 tw-rounded tw-w-[400px]">
                                  <span
                                    className="tw-text-blue-600 tw-cursor-pointer"
                                    onClick={() => {
                                      onFileDownload(file.fileKey, file.name);
                                    }}
                                  >
                                    {file.name}
                                  </span>
                                  <button
                                    className="tw-ml-2 tw-cursor-pointer"
                                    onClick={() => handleRemoveFile(order, index)}
                                  >
                                    <svg
                                      width={8}
                                      height={8}
                                      viewBox="0 0 6 6"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="flex-grow-0 flex-shrink-0"
                                      preserveAspectRatio="none"
                                    >
                                      <path
                                        d="M5.39571 0L3 2.39571L0.604286 0L0 0.604286L2.39571 3L0 5.39571L0.604286 6L3 3.60429L5.39571 6L6 5.39571L3.60429 3L6 0.604286L5.39571 0Z"
                                        fill="#6A7380"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <TextField
                                  size="small"
                                  onChange={e => {
                                    // console.log('e', e);
                                    if (file.serialNumber) {
                                      handleInputUrlChange(order, e, true, file.serialNumber);
                                    } else {
                                      handleInputUrlChange(order, e, false, index);
                                    }
                                  }}
                                  id="margin-none"
                                  value={file.externalSharingLink}
                                  name="clubName"
                                  placeholder="파일 url을 입력해주세요."
                                  sx={{
                                    backgroundColor: 'white',
                                    '& .MuiInputBase-root': {
                                      height: '28px', // 원하는 높이로 설정
                                    },
                                  }}
                                  onDragStart={e => e.preventDefault()} // Prevent default drag behavior on TextField
                                />
                                <div className="tw-w-[80px] tw-p-1.5 tw-text-center tw-bg-black tw-text-white tw-rounded tw-items-center tw-gap-2 tw-px-2">
                                  {isProcessing
                                    ? '등록 중'
                                    : file.fileUploadStatus === '0000'
                                    ? '등록 전'
                                    : file.fileUploadStatus === '1000'
                                    ? '등록 중'
                                    : file.fileUploadStatus === '2000'
                                    ? '등록 완료'
                                    : file.fileUploadStatus === '3000'
                                    ? '등록 실패'
                                    : '등록 전'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="tw-flex">
                <div className="tw-w-[130px] tw-py-5"></div>
                <div className="tw-w-11/12">
                  <div className="tw-w-full tw-flex tw-justify-start tw-px-5 tw-items-center">
                    {urlList?.length > 0 && (
                      <div className="tw-flex tw-py-2">
                        <div className="tw-flex tw-text-sm tw-items-start tw-mt-1" style={{ minWidth: '6.1rem' }}>
                          첨부된 URL :
                        </div>
                        <div className="tw-text-left tw-pl-5 tw-text-sm tw-flex-col">
                          {urlList.map((file, index) => (
                            <div key={index} className="tw-flex tw-items-center tw-gap-3 pb-2">
                              <div className="border tw-px-3 tw-p-1 tw-rounded">
                                <span className="tw-text-[#FF8F60]">{file.url}</span>
                                <button className="tw-ml-2 tw-cursor-pointer" onClick={() => handleDeleteInput(index)}>
                                  <svg
                                    width={8}
                                    height={8}
                                    viewBox="0 0 6 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="flex-grow-0 flex-shrink-0"
                                    preserveAspectRatio="none"
                                  >
                                    <path
                                      d="M5.39571 0L3 2.39571L0.604286 0L0 0.604286L2.39571 3L0 5.39571L0.604286 6L3 3.60429L5.39571 6L6 5.39571L3.60429 3L6 0.604286L5.39571 0Z"
                                      fill="#6A7380"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <div className="tw-p-1 tw-text-center tw-bg-black tw-text-white tw-rounded tw-items-center tw-gap-2 tw-px-2">
                                {isProcessing
                                  ? '등록 중'
                                  : file.fileUploadStatus === '0000'
                                  ? '등록 전'
                                  : file.fileUploadStatus === '1000'
                                  ? '등록 중'
                                  : file.fileUploadStatus === '2000'
                                  ? '등록 완료'
                                  : file.fileUploadStatus === '3000'
                                  ? '등록 실패'
                                  : '등록 전'}
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
        </div>
      </div>
    </div>
  );
};

export default LectureBreakerInfo;
