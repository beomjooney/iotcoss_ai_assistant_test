import React, { useEffect, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useUploadImage } from '../../../services/image/image.mutations';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { height } from '@mui/system';

export interface EditorProps {
  data?: any;
  onReady?: any;
  onChange?: any;
  onBlur?: any;
  onFocus?: any;
  className?: any;
  type?: 'seminar' | string;
  disabled?: boolean;
}

const cx = classNames.bind(styles);

const Editor = ({ data, onReady, onChange, onBlur, onFocus, className, type, disabled = false }: EditorProps) => {
  const editorRef = useRef();
  const [flag, setFlag] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const imgLink = `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images`;

  const { data: image, mutateAsync } = useUploadImage();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  const customUploadAdapter = loader => {
    // (2)
    return {
      upload() {
        return new Promise((resolve, reject) => {
          loader.file.then(file => {
            setFlag(false);

            const callImage = async () => {
              const image = await mutateAsync(file);
              if (!flag) {
                setFlag(true);
              }
              resolve({
                default: `${imgLink}/${image.toString().slice(1)}`,
              });
            };
            callImage();
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    // (3)
    editor.plugins.get('FileRepository').createUploadAdapter = loader => {
      return customUploadAdapter(loader);
    };
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
    <>
      {editorLoaded ? (
        <div className={cx(className, 'editor-container', type === 'seminar' && 'seminar-editor')}>
          <CKEditor
            editor={ClassicEditor}
            config={{
              // (4)
              extraPlugins: [uploadPlugin],
            }}
            data={data}
            onReady={onReady}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
          />
        </div>
      ) : (
        'loading...'
      )}
    </>
  );
};

export default Editor;
