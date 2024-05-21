import styles from './index.module.scss';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';
import {
  ChangeEventHandler,
  FocusEventHandler,
  ForwardedRef,
  forwardRef,
  ReactNode,
  isValidElement,
  MouseEventHandler,
} from 'react';
import Typography from '../Typography';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type ToggleType = 'default' | 'multiple' | 'tabRadio' | 'tabButton' | 'checkBox';
type VariantType = 'small' | 'medium' | 'large' | 'tabButton-left' | 'tabButton-center' | 'tabButton-right';
type WeightType = 'regular' | 'medium' | 'bold';

export interface ToggleLabelProps {
  /** Toggle의 레이블 */
  label: ReactNode;
  /** Toggle의 값 */
  value: any;
  /** 비활성화 여부 */
  disabled?: boolean;
  isJustStyleDisabled?: boolean;
  /** 부모 컴포넌트에서 disabled state 제어하기 위한 property입니다 */
  setDisabled?: boolean;
  /** 필수 여부 */
  required?: boolean;
  /** input 요소의 id */
  id?: string;
  /** input 요소의 name */
  name?: string;
  /** react-hook-form에 등록하기 위한 register 함수 */
  register?: UseFormRegister<any>;
  /** react-hook-form 옵션 */
  registerOptions?: RegisterOptions;
  /** default: 여러 Toggle 중에 하나 선택 가능, multiple: 복수 선택 가능 */
  type?: ToggleType;
  /** Toggle button에 보일 아이콘 */
  icon?: ReactNode;
  /** lost focus 이벤트 */
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** change 이벤트 */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** checked 여부 */
  checked?: boolean;
  /** default checked 여부 */
  defaultChecked?: boolean;
  /** ToggleGroup에서 사용 시 Group에 있는 모든 Toggle 선택할 여부 */
  selectAll?: boolean;
  /** Toggle의 형태: small or large */
  variant?: VariantType;
  /** display 형태 여부 */
  isDisplay?: boolean;
  className?: string;
  /** 꽉찬 active */
  isActive?: boolean;
  onClick?: MouseEventHandler<HTMLInputElement>;
  weight?: WeightType;
  isBorder?: boolean;
}

function ToggleRoot(props: ToggleLabelProps, ref: ForwardedRef<HTMLInputElement>) {
  const {
    type = 'default',
    register,
    required = false,
    disabled = false,
    setDisabled,
    variant = 'small',
    isDisplay = false,
    registerOptions,
    className,
    isJustStyleDisabled = false,
    isActive = false,
    weight = 'regular',
    isBorder = false,
  } = props;

  const inputType = type === 'multiple' || type === 'tabButton' || type === 'checkBox' ? 'checkbox' : 'radio';
  const inputProps = register ? register(props.name ?? props.value, { required, ...registerOptions }) : {};
  const classType = type === 'checkBox' ? 'container--checkbox' : 'container--toggle';
  return (
    <label
      className={cx('container', classType, className)}
      data-icon={!!props.icon}
      data-variant={!!props.icon && variant === 'medium' ? 'mediumIcon' : variant}
      data-checked={props.checked}
      data-tab-button={props.type === 'tabButton'}
      htmlFor={props.id}
    >
      <input
        {...inputProps}
        type={inputType}
        value={props.value}
        name={props.name}
        disabled={disabled || setDisabled || isDisplay}
        className={cx({ disabled: isJustStyleDisabled }, className)}
        required={register === undefined && required}
        ref={ref}
        onBlur={props.onBlur}
        onChange={props.onChange}
        onClick={props.onClick}
        checked={props.checked}
        id={props.id}
        defaultChecked={props.defaultChecked}
      />
      <span
        data-variant={variant}
        data-isdisplay={isDisplay}
        className={cx(isActive && 'active', isBorder ? 'isActive' : 'isNone')}
      >
        {isValidElement(props.label) ? props.label : props.label}
        {props.icon && props.icon}
      </span>
    </label>
  );
}

export default forwardRef<HTMLInputElement, ToggleLabelProps>(ToggleRoot);
