import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  ReactElement,
  ReactNode,
  FocusEvent,
  HTMLAttributes,
  MouseEventHandler,
  forwardRef,
  ForwardedRef,
  Dispatch,
  SetStateAction,
} from 'react';
import styles from './index.module.scss';
import classNames from 'classnames/bind';

// TODO : 추가 수정 필요 close
export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** 내용 */
  content: ReactNode;
  /** box 타입 Tooltip 타이틀 */
  boxTitle?: ReactNode;
  /** Tooltip 배치 */
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
  /** Tooltip을 나타내게 하는 이벤트 */
  trigger?: 'click' | 'mouseEnter';
  /** Tooltip 외관 타입 */
  variant?: 'box' | 'bubble' | 'custom';
  bgColor?: 'gray' | 'lite-gray' | 'blue';
  /** Tooltip을 화면에 처음부터 보이게 할지 여부 (default: false) */
  visible?: boolean;
  /** Tooltip 바깥 영역 클릭시 숨기게 할지 여부 (default: true) */
  hideOnClick?: boolean;

  /** 툴팁 박스의 translate X, Y position 스타일
   * (튜플로 x,y 를 입력, 변경하고 싶지 않은 위치에는 null 입력)
   * box 타입은 Y만 반영됨.
   * */
  translateXY?: [string | null, string | null];

  role?: string;

  onHide?: () => void;

  /** Tooltip trriger target children button,  */
  children?: ReactElement;

  className?: string;
  warpClassName?: string;
  /** 한번 닫으면 열리지 않도록 Event prevent */
  visibleOnce?: boolean;
  /** close button 없앨 수 있도록 */
  hideCloseButton?: boolean;
}

export interface TooltipHandle {
  setVisible: Dispatch<SetStateAction<boolean>>;
  getChildren: () => HTMLElement | null;
}

const cx = classNames.bind(styles);

function TooltipRoot(
  {
    content,
    boxTitle = '',
    placement = 'bottom',
    trigger = 'click',
    variant = 'box',
    visible = false,
    hideOnClick = false,
    translateXY = [null, null],
    role = 'tooltip',
    children,
    onHide,
    visibleOnce = false,
    className = '',
    hideCloseButton = false,
    warpClassName = '',
    bgColor = 'gray',
  }: TooltipProps,
  ref: ForwardedRef<TooltipHandle>,
) {
  const [isVisible, setVisible] = useState(false);
  const [[childrenWidth, childrenHeight], setChildrenSize] = useState<(string | number | null)[]>([null, null]);
  const clickCountRef = useRef(0);
  const childrenRef = useRef<HTMLElement | null>(null);

  const getChildren = () => childrenRef.current;
  const [translateX, translateY] = translateXY;
  const isBottom = placement?.includes('bottom');
  const positionXBasePercent =
    variant === 'box'
      ? (placement?.includes('start') && '0%') || (placement?.includes('end') && '-100%') || '-50%'
      : (placement?.includes('start') && '-5%') || (placement?.includes('end') && '-95%') || '-50%';

  const tooltipPositionStyle = (placement?.includes('start') && {
    transform: `translate(${translateX || `calc(${positionXBasePercent})`},${
      translateY || (isBottom ? '100%' : `calc(-100% - ${childrenHeight}px)`)
    })`,
  }) ||
    (placement?.includes('end') && {
      transform: `translate(${translateX || `calc(${positionXBasePercent} + ${Number(childrenWidth)}px)`},${
        translateY || (isBottom ? '100%' : `calc(-100% - ${childrenHeight}px)`)
      })`,
    }) || {
      transform: `translate(${translateX || `calc(${positionXBasePercent} + ${Number(childrenWidth) / 2}px)`},${
        translateY || (isBottom ? '100%' : `calc(-100% - ${childrenHeight}px)`)
      })`,
    };

  if (ref) {
    useImperativeHandle(ref, () => ({
      setVisible,
      getChildren,
    }));
  }

  useEffect(() => {
    if (isVisible === visible) return;
    setVisible(visible);
    clickCountRef.current += 1;
  }, [visible]);

  useEffect(() => {
    if (childrenWidth || childrenHeight) return;
    if (childrenRef.current && childrenRef.current instanceof HTMLElement) {
      const { width, height } = childrenRef.current.getBoundingClientRect();
      setChildrenSize([width, height]);
    }
  }, [childrenRef.current, childrenWidth, childrenHeight]);

  const hide = () => {
    onHide?.();
    isVisible && setVisible(false);
  };
  const handleHide = (e: React.MouseEvent<HTMLButtonElement>) => {
    hide();
    if (visibleOnce) {
      e.stopPropagation();
    }
  };
  const show = () => !isVisible && setVisible(true);

  const toggleVisible: MouseEventHandler<HTMLButtonElement | HTMLDivElement> = e => {
    const isHide =
      e.currentTarget.dataset['tooltipTarget'] ||
      (e.target instanceof HTMLElement && e.target.closest('[data-tooltip-target=true]'));
    if (visibleOnce) {
      e.stopPropagation();
      if (isHide) return;
    }
    if (trigger === 'mouseEnter') return;

    if (e.target instanceof HTMLElement && e.target.classList.contains('icon-system_close')) {
      hide();
      clickCountRef.current = 0;
      return;
    }

    if (isHide) {
      show();
      if (clickCountRef.current > 0) {
        hide();
        clickCountRef.current = 0;
        return;
      }
      clickCountRef.current += 1;
    }
  };

  const onMouseEnter: MouseEventHandler<HTMLButtonElement | HTMLDivElement> = e => {
    if (trigger !== 'mouseEnter') return;
    show();
  };

  const onMouseLeave: MouseEventHandler<HTMLButtonElement | HTMLDivElement> = e => {
    if (trigger !== 'mouseEnter') return;
    hide();
  };

  const onFocus = (e: FocusEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (trigger === 'click' && (e.target.dataset['tooltipTarget'] || e.target.closest('[data-tooltip-target=true]')))
      return;

    if (e.target.dataset['tooltipTarget'] && !e.currentTarget.contains(e.relatedTarget)) {
      clickCountRef.current += 1;
      show();
    }
  };

  const onBlur = (e: FocusEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (trigger === 'click' && !hideOnClick) return;

    if (!e.currentTarget.contains(e.relatedTarget)) {
      setVisible(false);
      clickCountRef.current = 0;
    }
  };

  if (!content) return null;

  return (
    <div
      className={cx('career-tooltip-wrap', warpClassName)}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children && (
        <children.type
          {...children.props}
          onClick={toggleVisible}
          aria-expanded={isVisible}
          data-tooltip-target={true}
          ref={childrenRef}
        />
      )}
      <div
        className={classNames(
          'career-tooltip',
          `career-tooltip-${variant}-type`,
          `after-${bgColor}`,
          isVisible && 'show',
          className,
        )}
        role={role}
      >
        <div className={classNames('tooltip-inner-mentors', placement)} style={tooltipPositionStyle}>
          <div className={classNames(`career-tooltip-${variant}`, bgColor)}>
            {variant === 'box' && boxTitle && <strong className={classNames(`box-title`)}>{boxTitle}</strong>}
            <div className={cx('tooltip-content')}>{content}</div>
            {/*{!hideCloseButton && (*/}
            {/*  <button className={cx('tooltip-close-button')} onClick={handleHide} type="button">*/}
            {/*    x*/}
            {/*  </button>*/}
            {/*)}*/}
            <div className={cx(`tooltip-${variant}__arrow`)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default forwardRef<TooltipHandle, TooltipProps>(TooltipRoot);
