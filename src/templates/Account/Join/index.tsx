import styles from './index.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Button, Typography } from '../../../stories/components';

const cx = classNames.bind(styles);

export function JoinTemplate() {
  const [allCheck, setAllCheck] = useState<boolean>(false);
  const [requiredCheck, setRequiredCheck] = useState<boolean>(false);
  const [choiceCheck, setChoiceCheck] = useState<boolean>(false);

  useEffect(() => {
    if (requiredCheck && choiceCheck) {
      setAllCheck(true);
    } else {
      setAllCheck(false);
    }
  }, [requiredCheck, choiceCheck]);

  const handleAllCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.currentTarget;
    if (!checked) {
      setRequiredCheck(false);
      setChoiceCheck(false);
    } else {
      setRequiredCheck(true);
      setChoiceCheck(true);
    }
    setAllCheck(checked);
  };

  return (
    <section className="hero-section ptb-100 full-screen">
      <div className="container">
        <div className="row align-items-center justify-content-center pt-5 pt-sm-5 pt-md-5 pt-lg-0">
          <div className="col-md-5 col-lg-5">
            <div className="card login-signup-card shadow-lg mb-0">
              <div className="card-body px-md-5 py-5">
                <div className={cx('header-title')}>
                  <div className={cx('logo')}>CM</div>
                  <div className="mb-5">
                    <Typography type="H3" weight="bold">
                      커리어멘토스
                    </Typography>
                    <p className="text-muted mb-0">주식회사 커리어멘토스</p>
                  </div>
                </div>
                <form className="login-signup-form">
                  <div className={cx('form-group', 'top-border', 'bottom-border', 'login-display', 'pt-3')}>
                    <input
                      type="checkbox"
                      checked={allCheck}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleAllCheck(event)}
                    />
                    <Typography type="H3">전체 동의하기</Typography>
                    <Typography type="C1" tag="p" extendClass="pl-3">
                      전체동의는 선택목적에 대한 동의를 포함하고 있으며, 선택목적에 대한 동의를 거부해도 서비스 이용이
                      가능합니다.
                    </Typography>
                  </div>
                  <div className={cx('form-group', 'bottom-border', 'pt-2')}>
                    <div className={cx('change-account', 'pl-3')}>
                      <Typography type="C1">hongil-dong@gmail.com</Typography>
                      <Typography type="B2" extendClass={cx('link')}>
                        계정변경
                      </Typography>
                    </div>
                    <Typography type="C1" tag="p" extendClass="pl-3 pt-3 pr-4">
                      커리어멘토스 서비스 제공을 위해 회원번호와 함께 개인정보가 제공됩니다. 보다 자세한 개인정보
                      제공항목은 동의 내용에서 확인하실 수 있습니다. 정보는 서비스 탈퇴 시 지체없이 파기됩니다.
                    </Typography>
                  </div>
                  <div className={cx('form-group', 'bottom-border')}>
                    <div className={cx('required-info')}>
                      <input
                        type="checkbox"
                        checked={requiredCheck}
                        onChange={() => setRequiredCheck(!requiredCheck)}
                      />
                      <Typography type="B2">필수 제공 확인 영역</Typography>
                      <div className={cx('right')}>
                        <Typography type="B2" extendClass={cx('link')}>
                          보기
                        </Typography>
                      </div>
                    </div>
                    <Typography type="C1" tag="p" extendClass="pl-3 pt-3 pr-4">
                      이름
                    </Typography>
                  </div>
                  <div className="form-group">
                    <div className={cx('choice-info')}>
                      <input type="checkbox" checked={choiceCheck} onChange={() => setChoiceCheck(!choiceCheck)} />
                      <Typography type="B2">
                        [선택] 커리어멘토스의 광고와 마케팅 메시지를 카카오톡으로 받습니다.
                      </Typography>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    label="동의하고 계속하기"
                    color={allCheck || requiredCheck ? 'kakao' : 'disabled'}
                    size="large"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JoinTemplate;
