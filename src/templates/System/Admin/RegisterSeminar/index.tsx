import classNames from 'classnames/bind';
import styles from './index.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { Toggle, Textfield, Button, Profile, Editor, Typography } from 'src/stories/components';
import { useJobGroups, usePlaceTypes } from 'src/services/code/code.queries';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { SeminarContent } from 'src/models/recommend';
import { useStore } from 'src/store';
import { UseQueryResult } from 'react-query';
import { useMentor, useMentorProfile } from 'src/services/mentors/mentors.queries';
import { useSessionStore } from 'src/store/session';
import { useSaveSeminar } from 'src/services/seminars/seminars.mutations';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useUploadImage } from 'src/services/image/image.mutations';

const cx = classNames.bind(styles);

export function RegisterSeminarTemplate() {
  const initSeminarData = {
    // seminarId: null,
    seminarTitle: null,
    seminarSubTitle: null,
    seminarIntroduction: null,
    seminarCurriculum: null,
    seminarFaq: null,
    description: null,
    url: null,
    imageUrl1: 'default.jpg',
    imageUrl2: 'default.jpg',
    imageUrl3: 'default.jpg',
    organizerMemberId: null,
    lecturerMemberId: null,
    lecturerName: null,
    seminarRegistrationStartDate: null,
    seminarRegistrationEndDate: null,
    currentParticipantCount: 0,
    participantCount: 0,
    paymentType: '0001', // 무료
    price: 0,
    keywords: [],
    seminarStatus: '0002', // defatul 0002 모집 중
    seminarType: '0001', // 컨퍼런스
    seminarStartDate: null,
    seminarEndDate: null,
    seminarPlaceType: null,
    seminarPlace: null,
    recommendJobGroups: [],
    recommendJobs: [],
    recommendLevels: [],
    recommendSkills: [],
    recommendExperiences: [],
  } as SeminarContent;

  const initIntroduceEditorData = `<p><i><strong>[해당내용은 내용작성의 참고를 위한 가이드 내용입니다. 가이드 내용 삭제 후 입력해주세요.]</strong></i></p><p><br data-cke-filler="true"></p><h2><strong>[분야] 세미나 타이틀 혹은 강조할 내용을 적어주세요.</strong></h2><h3>참가 자격 및 응모 대상</h3><ul><li>내용을 입력하세요.</li><li>예) 소프트웨어 엔지니어 취업을 원하는 청년 구직자</li></ul><p><br data-cke-filler="true"></p><h3>활동 내용</h3><ul><li>내용을 입력하세요.</li><li>예시는 아래를 참고하세요.</li></ul><p><br data-cke-filler="true"></p><ol><li><strong>어떤 개발자가 되고 싶은가요?</strong><ol><li>IT 취업 동향</li><li>SW분야 직무 분석</li></ol></li><li><strong>개발자가 되려면 어떻게 해야할까요?</strong><ol><li>…</li><li>…</li></ol></li></ol><p><br data-cke-filler="true"></p><h3>활동 혜택 (특전)</h3><ul><li>내용을 입력하세요.</li></ul><p><br data-cke-filler="true"></p><h3>응모 일정</h3><ul><li>모집:&nbsp;</li><li>최종발표:&nbsp;</li></ul><p><br data-cke-filler="true"></p><h3>접수 방법</h3><ul><li>내용을 입력하세요.</li></ul><p><br data-cke-filler="true"></p><h3>유의 사항(기타 사항)</h3><ul><li>내용을 입력하세요.</li></ul><p><br data-cke-filler="true"></p><h3>문의 사항</h3><ul><li>내용을 입력하세요.</li></ul><p><br data-cke-filler="true"></p><h3>행사 장소</h3><ul><li>내용을 입력하세요.</li></ul>`;
  const initCurriculumEditorData = `<p><i><strong>[해당내용은 내용작성의 참고를 위한 가이드 내용입니다. 가이드 내용 삭제 후 입력해주세요.]</strong></i></p><p><br data-cke-filler="true"></p><h3>활동 내용</h3><ul><li>내용을 입력하세요.</li><li>예시는 아래를 참고하세요.</li></ul><p><br data-cke-filler="true"></p><ol><li><strong>어떤 개발자가 되고 싶은가요?</strong><ol><li>IT 취업 동향</li><li>SW분야 직무 분석</li></ol></li><li><strong>개발자가 되려면 어떻게 해야할까요?</strong><ol><li>…</li><li>…</li></ol></li></ol>`;
  const initFaqEditorData = `<p><i><strong>[해당내용은 내용작성의 참고를 위한 가이드 내용입니다. 가이드 내용 삭제 후 입력해주세요.]</strong></i></p><h4><br data-cke-filler="true"></h4><h4>Q. FAQ 질문 타이틀 기재란</h4><p>FAQ 질문에 대한 답변을 입력해주세요.</p><p><br data-cke-filler="true"></p><h4>Q. FAQ 질문 타이틀 기재란</h4><p>FAQ 질문에 대한 답변을 입력해주세요.</p>`;

  const router = useRouter();
  const editorRef = useRef();
  const [page, setPage] = useState(1);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState<boolean>(false);
  const [data, setData] = useState<SeminarContent>(initSeminarData);
  const [introduceEditor, setIntroduceEditor] = useState(initIntroduceEditorData);
  const [curriculumEditor, setCurriculumEditor] = useState(initCurriculumEditorData);
  const [faqEditor, setFaqEditor] = useState(initFaqEditorData);
  const [files, setFiles] = useState({ imageUrl1: null, imageUrl2: null, imageUrl3: null });
  const [tempImageUrl1, setTempImageUrl1] = useState(null);
  const [tempImageUrl2, setTempImageUrl2] = useState(null);
  const [tempImageUrl3, setTempImageUrl3] = useState(null);
  const [searchMentorId, setSearchMentorId] = useState(null);
  const [isMentorSearching, setIsMentorSearching] = useState(false);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { jobGroups, setJobGroups, placeTypes, setPlaceTypes } = useStore();
  const { memberId } = useSessionStore.getState();
  const { data: mentorData, isFetched: isMentorFetched }: UseQueryResult<any> = useMentorProfile(data.lecturerMemberId);

  if (isMentorFetched && isMentorSearching) {
    if (!mentorData) {
      // 실패
      alert('입력하신 아이디의 멘토 정보가 조회되지 않습니다.');
    }
    setIsMentorSearching(false);
  }

  const levelInfo = [
    { level: 1, desc: '상용서비스 단위모듈 수준 개발 가능. 서비스 개발 리딩 시니어 필요' },
    { level: 2, desc: '상용서비스 개발 1인분 가능한 사람. 소규모 서비스 독자 개발 가능' },
    { level: 3, desc: '상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능' },
    { level: 4, desc: '다수 상용서비스 개발 리더. 수십명 혹은 수백명 수준의 개발자 총괄 리더' },
    { level: 5, desc: '본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩' },
  ];
  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));
  const { isFetched: isPlaceTypeFetched } = usePlaceTypes(data => setPlaceTypes(data || []));

  const { mutate: onSaveImage1, data: imageUrl1, isSuccess: imageSuccess1 } = useUploadImage();
  const { mutate: onSaveImage2, data: imageUrl2, isSuccess: imageSuccess2 } = useUploadImage();
  const { mutate: onSaveImage3, data: imageUrl3, isSuccess: imageSuccess3 } = useUploadImage();
  const { mutate: onSaveSeminar, isSuccess, status } = useSaveSeminar();

  const onFileChange = (files, key) => {
    if (!files || files.length === 0) return;
    setFiles(prevState => ({ ...prevState, [key]: files[0] }));
  };

  const readFile = (file, key) => {
    const reader = new FileReader();
    reader.onload = e => {
      const image = e.target.result;
      switch (key) {
        case 'imageUrl1':
          setTempImageUrl1(image);
          break;
        case 'imageUrl2':
          setTempImageUrl2(image);
          break;
        case 'imageUrl3':
          setTempImageUrl3(image);
          break;
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    Object.keys(files).map(key => {
      const file = files[key];
      if (!file) return;
      readFile(file, key);
    });
  }, [files]);

  const imageUploadItem = (title, key, imageUrl) => {
    return (
      <div className={cx('seminar-image-item')} key={key}>
        <span className={cx('seminar-image-item__title', 'area-title')}>{title}</span>
        <span className={cx('seminar-image-item__file-size', 'area-desc')}>500kb 이상</span>
        <div className={cx('seminar-image-item__upload-wrap')}>
          {imageUrl && <img src={imageUrl} alt={title} />}
          <Button type="button" color="secondary">
            <label htmlFor={`input-file-${key}`}>Image Upload</label>
            <input
              hidden
              id={`input-file-${key}`}
              accept="image/*"
              type="file"
              onChange={e => onFileChange(e.target?.files, key)}
            />
          </Button>
        </div>
      </div>
    );
  };

  const handlePickerChange = (moment, key) => {
    const datetime = moment.format('YYYY-MM-DD HH:mm:ss.SSS');
    setData({ ...data, [key]: datetime });
  };

  const handleCheckboxChange = (e, key) => {
    const { value, checked } = e.target;
    const temp = new Set(data[key]);
    const isNumberType = key === 'recommendLevels';
    if (checked) temp.add(isNumberType ? parseInt(value) : value);
    else temp.delete(value);
    setData({ ...data, [key]: [...temp] });
  };

  const handleToggleChange = (e, key) => {
    const { value } = e.target;
    setData({ ...data, [key]: value });
  };

  const handleTextfieldChange = (e, key) => {
    const value = e.target.value;
    if (key === 'keywords') {
      const keywords = value.split(' ').map(_ => _.replace(/\#/g, ''));
      setData({ ...data, keywords });
    } else if (key === 'participantCount') {
      setData({ ...data, [key]: parseInt(value) });
    } else {
      setData({ ...data, [key]: value });
    }
  };

  const handleNextPage = () => {
    if (!files.imageUrl1 || !files.imageUrl2 || !files.imageUrl3) {
      alert('사진을 등록해주세요.');
      return;
    }
    if (
      !data.seminarTitle ||
      !data.seminarSubTitle ||
      !data.seminarRegistrationStartDate ||
      !data.seminarRegistrationEndDate ||
      !data.seminarStartDate ||
      !data.seminarEndDate ||
      !data.seminarPlace ||
      !data.participantCount
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (
      !data.keywords ||
      data.keywords?.length === 0 ||
      !data.recommendLevels ||
      data.recommendLevels?.length === 0 ||
      !data.recommendJobGroups ||
      data.recommendJobGroups?.length === 0 ||
      !data.seminarPlaceType
    ) {
      alert('모든 항목을 선택해주세요.');
      return;
    }
    if (
      data.seminarStartDate > data.seminarEndDate ||
      data.seminarRegistrationStartDate > data.seminarRegistrationEndDate
    ) {
      alert('시작일은 종료일 보다 클 수 없습니다.');
      return;
    }

    if (data.seminarStartDate <= data.seminarRegistrationEndDate) {
      alert('세미나 시작일은 접수 종료일 이후로 지정해주세요.');
      return;
    }
    if (!marketingAgree) {
      alert('마케팅 활용에 동의하지 않으시면 세미나 등록이 불가합니다.');
      return;
    }
    setPage(2);
  };

  const handleLectureMember = () => {
    if (!searchMentorId || searchMentorId?.length <= 0) {
      alert('멘토 아이디를 입력해주세요.');
      return;
    }
    setData({ ...data, lecturerMemberId: searchMentorId });
    setIsMentorSearching(true);
  };

  const handleSubmit = () => {
    if (!introduceEditor || !curriculumEditor || introduceEditor?.length === 0 || curriculumEditor?.length === 0) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (!mentorData || searchMentorId !== data.lecturerMemberId) {
      alert('멘토 조회가 필요합니다.');
      return;
    }

    // 이미지 업로드 부터 시행
    onSaveImage1(files.imageUrl1);
    onSaveImage2(files.imageUrl2);
    onSaveImage3(files.imageUrl3);
  };

  // 최종 세미나 개설 시행
  if (status === 'idle' && imageSuccess1 && imageSuccess2 && imageSuccess3) {
    let param = {
      ...data,
      seminarId: `seminar_${Date.now()}`,
      seminarLecturer: mentorData,
      seminarIntroduction: introduceEditor,
      seminarCurriculum: curriculumEditor,
      seminarFaq: faqEditor,
      lecturerMemberId: mentorData.memberId,
      lecturerName: mentorData.name,
      organizerMemberId: memberId, // 등록자
      paymentType: '0001', // 무료
      registDate: moment().format('YYYY-MM-DD hh:mm:ss.SSS'),
    };
    param = {
      ...param,
      // 앞에 / 붙여와서 지움
      imageUrl1: imageUrl1.toString().slice(1),
      imageUrl2: imageUrl2.toString().slice(1),
      imageUrl3: imageUrl3.toString().slice(1),
    };
    onSaveSeminar(param);
  }
  if (isSuccess) {
    router.push('/seminar');
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    editorRef.current = {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    setEditorLoaded(true);
  }, []);

  return (
    <article className={cx('register-seminar-container')}>
      <section className={cx('content')}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <div className={cx('basic-info-page', page !== 1 && 'basic-info-page--hidden')}>
            <Typography type="H2" extendClass={cx('content__title')}>
              세미나 기본 정보
            </Typography>
            <Textfield
              label="세미나 대제목"
              placeholder="고객을 사로잡는 디지털 콘텐츠 마케팅 전략"
              required
              isUnderline
              className={cx('basic-info-page__text-field')}
              onChange={e => handleTextfieldChange(e, 'seminarTitle')}
              description="나누고 싶은 주제"
            />
            <Textfield
              label="세미나 소제목"
              placeholder="교보문고, 예스24, 마케팅 분야 베스트셀러 저자 직강!"
              required
              isUnderline
              className={cx('basic-info-page__text-field')}
              onChange={e => handleTextfieldChange(e, 'seminarSubTitle')}
              description="진행자 소개"
            />
            <Textfield
              isUnderline
              label="해시태그"
              className={cx('basic-info-page__text-field')}
              placeholder="#해시태그를 입력해주세요. 띄어쓰기하여 여러개를 입력할 수 있습니다."
              onChange={e => handleTextfieldChange(e, 'keywords')}
            />
            <div className={cx('seminar-jobgroup-area', 'check-area')}>
              <span className={cx('area-title')}>세미나 추천직군</span>
              <span className={cx('area-desc')}>* 다중 선택 가능</span>
              <div>
                {isJobGroupFetched &&
                  jobGroups.map(item => (
                    <Toggle
                      isActive
                      label={item.name}
                      name={item.name}
                      type="checkBox"
                      value={item.id}
                      key={item.id}
                      className={cx('seminar-jobgroup-area__item', 'check-area__item')}
                      onChange={e => handleCheckboxChange(e, 'recommendJobGroups')}
                    />
                  ))}
              </div>
            </div>
            <div className={cx('seminar-level-area')}>
              <span className={cx('area-title')}>세미나 추천레벨</span>
              <span className={cx('area-desc')}>* 다중 선택 가능</span>
              <div className={cx('seminar-level-area__check-area', 'check-area', 'row')}>
                {levelInfo.map(item => (
                  <span key={item.level} className={cx('seminar-level-area__item', 'check-area__item', 'col-md-2')}>
                    <Toggle
                      isActive
                      label={`${item.level}레벨`}
                      name={`${item.level}레벨`}
                      type="checkBox"
                      value={item.level}
                      onChange={e => handleCheckboxChange(e, 'recommendLevels')}
                    />
                    <p>{item.desc}</p>
                  </span>
                ))}
              </div>
            </div>
            <div className={cx('seminar-image-area')}>
              <div className={cx('seminar-image-area__upload')}>
                {imageUploadItem('멘토님 상반신 사진', 'imageUrl1', tempImageUrl1)}
                {imageUploadItem('세미나 장표 #1', 'imageUrl2', tempImageUrl2)}
                {imageUploadItem('세미나 장표 #2', 'imageUrl3', tempImageUrl3)}
              </div>
              <div className={cx('seminar-image-area__desc', 'check-area')}>
                <Toggle
                  isActive
                  label="커리어멘토스에 업로드된 이미지를 활용한 배너 제작 및 마케팅 활용에 동의합니다."
                  type="checkBox"
                  value={marketingAgree}
                  className={cx('check-area__item')}
                  onChange={() => setMarketingAgree(!marketingAgree)}
                />
              </div>
            </div>
            <div className={cx('seminar-date-area')}>
              <p className={cx('area-title')}>세미나 진행 일시</p>
              <div>
                <DateTimePicker
                  label="세미나 시작일시"
                  inputFormat="YYYY-MM-DD HH:mm"
                  value={data.seminarStartDate}
                  className={cx('basic-info-page__picker')}
                  onChange={e => handlePickerChange(e, 'seminarStartDate')}
                  renderInput={params => <TextField {...params} variant="standard" />}
                />
                <DateTimePicker
                  label="세미나 종료일시"
                  inputFormat="YYYY-MM-DD HH:mm"
                  value={data.seminarEndDate}
                  className={cx('basic-info-page__picker')}
                  onChange={e => handlePickerChange(e, 'seminarEndDate')}
                  renderInput={params => <TextField {...params} variant="standard" />}
                />
              </div>
            </div>{' '}
            <div className={cx('seminar-register-date-area')}>
              <p className={cx('area-title')}>세미나 신청 접수 기간</p>
              <div>
                <DateTimePicker
                  label="세미나 접수 시작일시"
                  inputFormat="YYYY-MM-DD HH:mm"
                  value={data.seminarRegistrationStartDate}
                  className={cx('basic-info-page__picker')}
                  onChange={e => handlePickerChange(e, 'seminarRegistrationStartDate')}
                  renderInput={params => <TextField {...params} variant="standard" />}
                />
                <DateTimePicker
                  label="세미나 접수 종료일시"
                  inputFormat="YYYY-MM-DD HH:mm"
                  value={data.seminarRegistrationEndDate}
                  className={cx('basic-info-page__picker')}
                  onChange={e => handlePickerChange(e, 'seminarRegistrationEndDate')}
                  renderInput={params => <TextField {...params} variant="standard" />}
                />
              </div>
            </div>
            <div className={cx('seminar-location-area')}>
              <p className={cx('area-title')}>위치</p>
              <div className={cx('seminar-location-area__detail-address')}>
                {isPlaceTypeFetched &&
                  placeTypes.map((item, i) => (
                    <Toggle
                      key={item.id}
                      label={item.name}
                      name={item.name}
                      value={item.id}
                      variant="medium"
                      isActive
                      checked={data.seminarPlaceType === item.id}
                      className={cx('fixed-width', 'seminar-location-area__toggle')}
                      onChange={e => handleToggleChange(e, 'seminarPlaceType')}
                    />
                  ))}
              </div>
              <Textfield
                isUnderline
                className={cx('basic-info-page__text-field', 'seminar-location-area__detail-address')}
                placeholder="세미나 진행 희망 장소를 입력해주세요. 예) 서울 강남권 소규모 폐쇄공간"
                onChange={e => handleTextfieldChange(e, 'seminarPlace')}
              />
            </div>{' '}
            <div className={cx('seminar-participant-area')}>
              <Textfield
                isUnderline
                onlyNumbers
                label="모집 인원"
                placeholder="00 명"
                className={cx('basic-info-page__text-field', 'seminar-participant-area__text-field')}
                onChange={e => handleTextfieldChange(e, 'participantCount')}
              />
            </div>
            <div className={cx('content__footer')}>
              <Button type="button" color="primary" onClick={() => handleNextPage()} className={cx('page-next-button')}>
                다음 페이지 &gt;
              </Button>
            </div>
          </div>
          <div className={cx('detail-info-page', page !== 2 && 'detail-info-page--hidden')}>
            <Typography type="H2" extendClass={cx('content__title')}>
              세미나 세부 정보
            </Typography>
            <div className={cx('seminar-introduce-area', 'not-pt')}>
              <p className={cx('area-title')}>세미나 소개</p>
              <Editor
                type="seminar"
                data={introduceEditor}
                onChange={(event, editor) => {
                  setIntroduceEditor(editor.getData());
                }}
              />
            </div>
            <hr />
            <div className={cx('mentor-introduce-area')}>
              <div className={cx('mentor-introduce-area__search-area')}>
                <Textfield
                  isUnderline
                  label="멘토 소개"
                  placeholder="멘토 아이디"
                  className={cx('basic-info-page__text-field', 'mentor-introduce-area__text-field')}
                  onChange={e => {
                    setSearchMentorId(e.target.value);
                    setIsMentorSearching(false);
                  }}
                />
                <Button type="button" color="lite-gray" size="small" onClick={() => handleLectureMember()}>
                  조회
                </Button>
              </div>
              <div className={cx('mentor-info')}>
                {searchMentorId && mentorData && (
                  <>
                    <Profile mentorInfo={mentorData} showDesc isDetail className={cx('mentor-info__profile')} />
                    <div className={cx('mentor-info__desc')}>
                      <div className={cx('mentor-introduce-area__desc-text-field')}>
                        <span>
                          멘토 소개 페이지에 기재된 내용으로 자동 연동됩니다. <br />
                          내용 수정이 필요하시면 MY 멘토 프로필에서 수정해주시기 바랍니다.
                        </span>
                      </div>
                      <Button type="button" color="lite-gray" className={cx('mentor-button')}>
                        멘토 소개 페이지 가기
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <hr />
            <div className={cx('seminar-curriculum-area')}>
              <p className={cx('area-title')}>커리큘럼</p>
              <Editor
                type="seminar"
                data={curriculumEditor}
                onChange={(event, editor) => setCurriculumEditor(editor.getData())}
              />
            </div>
            <hr />
            <div className={cx('seminar-faq-area')}>
              <p className={cx('area-title')}>FAQ</p>
              <Editor type="seminar" data={faqEditor} onChange={(event, editor) => setFaqEditor(editor.getData())} />
            </div>
            <div className={cx('content__footer')}>
              <Button type="button" color="lite-gray" size="small" onClick={() => setPage(1)}>
                &lt; 이전 페이지
              </Button>
              <Button type="button" color="primary" size="small" onClick={() => handleSubmit()} className={cx('ml-5')}>
                세미나 개설하기
              </Button>
            </div>
          </div>
        </LocalizationProvider>
      </section>
    </article>
  );
}
