import { Story, Meta } from '@storybook/react';
import Textfield, { TextfieldProps } from '.';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default {
  component: Textfield,
  title: 'components/Textfield',
  parameters: {
    docs: {
      description: {
        component: `
- children 으로 성공, 실패 메세지 제어, className='error' | 'success'.
- react-hook-form 적용시 성공 실패 메세지 제어를 위한 submitted 필요 (success 조건)
- react-hook-form register : https://react-hook-form.com/api/useform/register
        `,
      },
    },
  },
} as Meta;

/** Template_normal */
const Template_normal: Story<TextfieldProps> = args => {
  const { handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    alert(JSON.stringify('no react-hook-form'));
  };

  const onError = (e: any) => {
    console.log('error', e);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Textfield label="unControl" clearable="" />
        <br />
        <Textfield defaultValue="default value" label="unControl, Required" required />
        <br />
        <Textfield defaultValue="default value" label="unControl, underline, Required" isUnderline={true} required />
        <br />
        <div style={{ marginTop: '20px' }}>
          <input
            type="submit"
            style={{ padding: '10px', color: 'white', backgroundColor: 'black', borderRadius: '8px' }}
          />
        </div>
        <br />
        <br />
        <Textfield label="전화번호 대쉬('-') 자동 완성" name="textfield6" isPhoneNumber={true} />
      </form>
    </div>
  );
};

export const Default = Template_normal.bind({});
Default.args = {
  label: 'control, onChange, clearable',
  name: 'textfield2',
};

/** Template_hookForm */
const Template_hookForm: Story<TextfieldProps> = args => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    alert(JSON.stringify(data));
    setSubmitted(true);
  };

  const [submitted, setSubmitted] = useState(false);
  const onError = (e: any) => {
    console.log('error', e);
    setSubmitted(true);
  };

  const tf0Model = {
    register: register('textfield0', {
      value: 'value',
      required: 'Textfield 0 Required',
      maxLength: { value: 20, message: 'error:: maxLength=20' },
    }),
  };

  const tf1Model = {
    register: register('textfield1', {
      value: 'initialValue',
      required: 'Textfield 1 Required',
      maxLength: { value: 20, message: 'error:: maxLength=20' },
    }),
    watchValue: watch('textfield1', 'initialValue'), // hook form 사용시 값 확인
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <br />
        <br />
        <Textfield
          label="register, required, maxLength 20"
          register={tf0Model.register}
          required
          isError={Boolean(errors['textfield0'])}
          placeholder={'내용을 입력해주세요'}
        >
          {errors['textfield0'] && <div className="error">{errors['textfield0'].message}</div>}
          {submitted && !errors['textfield0'] && <div className="success">성공메세지</div>}
        </Textfield>
        <br />
        <div style={{ marginTop: '20px' }}>
          <input
            type="submit"
            style={{ padding: '10px', color: 'white', backgroundColor: 'black', borderRadius: '8px' }}
          />
        </div>
      </form>
    </div>
  );
};

export const ReactHookForm = Template_hookForm.bind({});
ReactHookForm.args = {
  label: 'register, required, maxLength 20',
  name: 'textfield0',
};
