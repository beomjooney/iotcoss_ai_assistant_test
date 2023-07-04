import styles from './index.module.scss';
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  ForwardedRef,
  useMemo,
  FocusEventHandler,
  KeyboardEventHandler,
} from 'react';
import { ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import classNames from 'classnames/bind';
import debounce from 'lodash-es/debounce';
import Typography from '../Typography';

export interface TextfieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** react-hook-form register */
  register?: UseFormRegisterReturn;
  /** Textfield Label */
  label?: string | ReactNode;
  /** 텍스트 삭제 기능 없으면 동작하지 않고, value | defaultValue 주입시 length에 따라 동작 */
  clearable?: string;
  /** 에러 스타일 적용을 위한 props */
  isError?: boolean;
  /** 텍스트 정렬 */
  align?: 'left' | 'right';
  /** 전화번호 자동 - 추가*/
  isPhoneNumber?: boolean;
  /** 왼쪽 아이콘 */
  iconLeft?: ReactNode;
  /** 오른쪽 아이콘 */
  iconRight?: ReactNode;
  /** onFocus Event*/
  onFocus?: FocusEventHandler;
  /** onKeydown Event*/
  onKeyDown?: KeyboardEventHandler;
  // name?: string;
  type?: string;
  value?: string | number;
  disabled?: boolean;
  // required?: boolean;
  /** 숫자만 입력 가능 여부 */
  onlyNumbers?: boolean;
  /** 언더라인만 표시되는 inputbox */
  isUnderline?: boolean;
  className?: string;
  /** 설명 */
  description?: string;
  isTextCenter?: boolean;
  width?: number;
}

const cx = classNames.bind(styles);

function TextfieldRoot(props: TextfieldProps, ref?: ForwardedRef<HTMLInputElement>) {
  const {
    register,
    name,
    id,
    label,
    type,
    required,
    clearable,
    isError,
    align,
    isPhoneNumber,
    iconLeft,
    iconRight,
    children,
    className,
    onFocus,
    onKeyDown,
    onlyNumbers,
    isUnderline = false,
    description,
    isTextCenter = false,
    width,
    ...rest
  } = props;

  const rootDomRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(props.value);
  useEffect(() => {
    if (!props.value) {
      const rootDom = rootDomRef.current as HTMLDivElement;
      const input = rootDom.querySelector('input');
      input && setInputValue(input.value);
    }
    setFilled(Boolean(getInputValue()));
    return () => {
      blurDebounced.cancel();
    };
  }, []);

  const [hasFocus, setHasFocus] = useState(false);
  const [filled, setFilled] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let tmpVal: string = e.target.value;
    let tickNumber = 0;
    let resultVal = '';

    if (isPhoneNumber) {
      if (tmpVal) {
        tmpVal = tmpVal.replace(/[^0-9]/g, '').replace(/-/g, '');
        if (tmpVal.substring(0, 2) === '02') {
          if (tmpVal.length <= 9) {
            tmpVal = tmpVal.substring(0, 9);
            resultVal = tmpVal.replace(/^(\d{0,2})(\d{0,3})(\d{0,4})$/g, '$1-$2-$3').replace(/-{1,2}$/g, '');
          } else if (tmpVal.length >= 10) {
            tmpVal = tmpVal.substring(0, 10);
            resultVal = tmpVal.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3').replace(/-{1,2}$/g, '');
          }

          setInputValue(resultVal);
          e.target.value = resultVal;
          props.onChange && props.onChange(e);
        } else {
          if (tmpVal.length <= 10) {
            tmpVal = tmpVal.substring(0, 10);
            resultVal = tmpVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})$/g, '$1-$2-$3').replace(/-{1,2}$/g, '');
          } else if (tmpVal.length >= 11) {
            tmpVal = tmpVal.substring(0, 11);
            resultVal = tmpVal.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3').replace(/-{1,2}$/g, '');
          }

          setInputValue(resultVal);
          e.target.value = resultVal;
          props.onChange && props.onChange(e);
        }
      } else {
        setInputValue(tmpVal);
        e.target.value = resultVal;
        props.onChange && props.onChange(e);
      }
    } else if (onlyNumbers && tmpVal) {
      resultVal = tmpVal.replace(/[^0-9]/g, '').replace(/-/g, '');
      setInputValue(resultVal);
      e.target.value = resultVal;
      props.onChange && props.onChange(e);
    } else {
      setInputValue(e.target.value);
      props.onChange && props.onChange(e);
    }
  };

  /* useMemo 하지 않으면 hook form submit 이후 error일 때
   * blurDebounce 가 변경되어 error 포커스 이벤트 발생 시 blurDebounced.cancel() 이 동작하지 않음
   */
  const blurDebounced = useMemo(
    () =>
      debounce(() => {
        setHasFocus(false);
        setFilled(Boolean(getInputValue()));
      }, 100),
    [],
  );
  const handleFocus = (e: React.FocusEvent) => {
    switch (e.type) {
      case 'focus':
        setHasFocus(true);
        blurDebounced.cancel();
        break;
      case 'blur':
        blurDebounced();
        //포커스 아웃일때 value가 있으면 filled 적용
        break;
    }
  };

  const clear = () => {
    const rootDom = rootDomRef.current as HTMLDivElement;
    const input = rootDom.querySelector('input');
    let nativeInputValueSetter: any = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    nativeInputValueSetter = nativeInputValueSetter.set;

    if (input) {
      nativeInputValueSetter.call(input, '');
      input.focus();
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    setInputValue('');
  };

  const getInputValue = () => {
    const rootDom = rootDomRef.current as HTMLDivElement;
    const input = rootDom.querySelector('input');
    return input?.value || '';
  };

  return (
    <div
      className={cx('container', className)}
      data-required={required}
      data-iserror={isError}
      data-filled={filled}
      data-align={align}
      data-readonly={props.readOnly}
      data-disabled={props.disabled}
      data-description={!!description}
      ref={rootDomRef}
    >
      {label && (
        <label htmlFor={id || name || (register ? register.name : undefined)}>
          {typeof label === 'string' ? <Typography type="C1">{label}</Typography> : label}
          {required && <span className={cx('required')}>필수입력</span>}
          {description && <span className={cx('description')}>{description}</span>}
        </label>
      )}
      <div
        className={cx(isUnderline ? 'wrap-input__underline' : 'wrap-input', hasFocus && 'focus')}
        style={{ width: width > 0 && width }}
        onFocus={handleFocus}
        onBlur={handleFocus}
      >
        {iconLeft && <div className={cx('wrap-icon', 'left')}>{iconLeft}</div>}

        {register ? (
          isPhoneNumber ? (
            <input
              {...register}
              {...rest}
              id={id || name || (label ? register.name : undefined)}
              type={type || 'text'}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
              onChange={handleChange}
              maxLength={13}
              placeholder={props.placeholder}
              style={{ textAlign: isTextCenter ? 'center' : 'left' }}
            />
          ) : (
            <input
              {...register}
              {...rest}
              id={id || name || (label ? register.name : undefined)}
              type={type || 'text'}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
              {...(onlyNumbers ? { onChange: handleChange } : null)}
              placeholder={props.placeholder}
              style={{ textAlign: isTextCenter ? 'center' : 'left' }}
            />
          )
        ) : (
          <input
            {...rest}
            name={name}
            id={id || name}
            type={type || 'text'}
            required={required}
            onChange={handleChange}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            ref={ref}
            style={{ textAlign: isTextCenter ? 'center' : 'left' }}
          />
        )}
        {(props.register ? clearable?.length : !(clearable === undefined) && inputValue?.toString().length) &&
        hasFocus &&
        !props.readOnly ? (
          <button type="button" className={cx('button-input-clear')} onClick={clear}>
            clear
          </button>
        ) : null}
        {iconRight && <div className={cx('wrap-icon', 'right')}>{iconRight}</div>}
      </div>
      {children && <div className={cx('wrap-children')}>{children}</div>}
    </div>
  );
}

export default forwardRef(TextfieldRoot);
