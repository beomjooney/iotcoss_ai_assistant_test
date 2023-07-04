import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import { Banner, Textfield, Toggle, Chip, Typography, Button, Editor } from 'src/stories/components';
import { useJobGroups } from 'src/services/code/code.queries';
import { useStore } from 'src/store';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import { paramProps } from 'src/services/community/community.queries';
import { TagsInput } from 'react-tag-input-component';
import { useSaveCommunity, useModifyCommunity } from 'src/services/community/community.mutations';
import { useRouter } from 'next/router';

interface PostDetailTemplateProps {
  postData: any;
}

const cx = classNames.bind(styles);

// dummy data
export function CommunityWriteTemplate({ postData }: PostDetailTemplateProps) {
  const { jobGroups, setJobGroups, contentTypes, setContentTypes } = useStore();
  const [jobGroupsFilter, setJobGroupsFilter] = useState([]);
  const [levelsFilter, setLevelsFilter] = useState([]); // TODO 개발 필요
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [postNo, setPostNo] = useState(0);
  const [selected, setSelected] = useState([]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [faqEditor, setFaqEditor] = useState(null);
  const { mutate: onSaveCommunity, isSuccess } = useSaveCommunity();
  const { mutate: onModifyCommunity, isSuccess: isSuccessModify } = useModifyCommunity();
  const { isFetched: isJobGroupFetched } = useJobGroups(data => setJobGroups(data || []));

  const router = useRouter();

  useEffect(() => {
    if (isSuccess || isSuccessModify) {
      router.push('/community');
    }
  }, [isSuccess, isSuccessModify]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    editorRef.current = {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    setEditorLoaded(true);
    if (postData) {
      setJobGroupsFilter(postData?.data?.relatedJobGroups);
      setLevelsFilter(postData?.data?.relatedLevels);
      setSelected(postData?.data?.keywords);
      setFaqEditor(postData?.data?.body);
      setPostNo(postData?.data?.postNo);
    }
  }, []);
  // const Editor = dynamic(() => import('src/stories/components/Editor'), { ssr: false });

  const toggleFilter = (id, type: 'jobGroup' | 'level') => {
    if (type === 'jobGroup') {
      const index = jobGroupsFilter.indexOf(id);
      setJobGroupsFilter(prevState => setNewCheckItem(id, index, prevState));
    } else {
      const index = levelsFilter.indexOf(id);
      setLevelsFilter(prevState => setNewCheckItem(id, index, prevState));
    }
  };

  const setNewCheckItem = (id, index, prevState) => {
    const newState = [...prevState];
    if (index > -1) newState.splice(index, 1);
    else newState.push(id);
    return newState;
  };

  const handleSubmit = () => {
    let allJobGroup = [];
    let allLevelGroup = [];
    if (jobGroupsFilter.length === 0) {
      allJobGroup = ['0200', '0300', '0400', '0100'];
    } else {
      allJobGroup = jobGroupsFilter;
    }

    if (levelsFilter.length === 0) {
      allLevelGroup = [1, 2, 3, 4, 5];
    } else {
      allLevelGroup = levelsFilter;
    }

    console.log(allJobGroup);
    const param = {
      // ...data,
      postCategory: '0001',
      title: '',
      body: faqEditor,
      keywords: selected,
      relatedJobGroups: allJobGroup,
      relatedLevels: allLevelGroup,
    };
    // console.log(levelsFilter);
    onSaveCommunity(param);
  };

  const handleModifySubmit = () => {
    let allJobGroup = [];
    let allLevelGroup = [];
    if (jobGroupsFilter.length === 0) {
      allJobGroup = ['0200', '0300', '0400', '0100'];
    } else {
      allJobGroup = jobGroupsFilter;
    }

    if (levelsFilter.length === 0) {
      allLevelGroup = [1, 2, 3, 4, 5];
    } else {
      allLevelGroup = levelsFilter;
    }

    console.log(allJobGroup);
    const param = {
      // ...data,
      postNo: postNo,
      postCategory: '0001',
      title: '',
      body: faqEditor,
      keywords: selected,
      relatedJobGroups: allJobGroup,
      relatedLevels: allLevelGroup,
    };
    console.log(param);
    onModifyCommunity(param);
  };

  return (
    <div className={cx('community-write-container')}>
      <Banner title="커뮤니티" subTitle="커멘니티" imageName="top_banner_community.svg" />
      <div className={cx('container')}>
        <article>
          <div className={cx('filter-area', 'row')}>
            <div className={cx('mentoring-button__group')}>
              <Typography type="B1" bold>
                직군
              </Typography>
              <Toggle
                label="전체"
                name="mentoring"
                value="ALL"
                variant="small"
                isActive
                checked={jobGroupsFilter.length === 0}
                type="checkBox"
                onChange={() => {
                  setJobGroupsFilter([]);
                }}
              />
              {isJobGroupFetched &&
                jobGroups.map(item => (
                  <Toggle
                    key={item.id}
                    label={item.name}
                    name={item.name}
                    value={item.id}
                    variant="small"
                    type="checkBox"
                    checked={jobGroupsFilter.indexOf(item.id) >= 0}
                    isActive
                    onChange={() => toggleFilter(item.id, 'jobGroup')}
                  />
                ))}
            </div>
            <div className={cx('mentoring-button__group')}>
              <Typography type="B1" bold>
                레벨
              </Typography>
              <Toggle
                label="전체"
                name="mentoring"
                value="ALL"
                variant="small"
                isActive
                checked={levelsFilter.length === 0}
                type="checkBox"
                onChange={() => {
                  setLevelsFilter([]);
                }}
              />
              {isJobGroupFetched &&
                [1, 2, 3, 4, 5].map(level => (
                  <Toggle
                    key={`level-${level}`}
                    label={`${level}레벨`}
                    name={`level-${level}`}
                    value={level}
                    variant="small"
                    type="checkBox"
                    checked={levelsFilter.indexOf(level) >= 0}
                    isActive
                    onChange={() => toggleFilter(level, 'level')}
                  />
                ))}
            </div>
          </div>
          <Editor
            data={faqEditor}
            onChange={(event, editor) => setFaqEditor(editor.getData())}
            className={cx('ck-editor__editable_inline')}
          />
          {/*{editorLoaded ? (*/}
          {/*  <CKEditor*/}
          {/*    className="mt-3 wrap-ckeditor"*/}
          {/*    data={faqEditor}*/}
          {/*    onChange={(event, editor) => setFaqEditor(editor.getData())}*/}
          {/*    editor={ClassicEditor}*/}
          {/*  />*/}
          {/*) : (*/}
          {/*  'loading...'*/}
          {/*)}*/}
          <div className={cx('tag-area')}>
            <TagsInput
              value={selected}
              onChange={setSelected}
              name="fruits"
              placeHolder="#해쉬태그 입력 후 엔터를 쳐주세요.
"
            />
          </div>
          {/* <div className={cx('image-area')}>
            <span>사진첨부 : </span>
            {['image1', 'image2'].map((image, i) => (
              <Chip key={i} chipColor="gray" radius={4} variant="outlined" className={cx('image_area__item')}>
                {image}
                <span className={cx('ti-close', 'ml-1')} />
              </Chip>
            ))}
          </div> */}
        </article>
        <div className="text-center">
          <Button
            className={'mr-3'}
            type="button"
            color="primary"
            size="small"
            onClick={() => router.push('/community')}
          >
            뒤로가기
          </Button>
          {postData ? (
            <Button type="button" color="primary" size="small" onClick={() => handleModifySubmit()}>
              수정하기
            </Button>
          ) : (
            <Button type="button" color="primary" size="small" onClick={() => handleSubmit()}>
              업로드
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityWriteTemplate;
