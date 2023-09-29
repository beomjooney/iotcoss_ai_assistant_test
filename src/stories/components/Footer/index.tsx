import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { Typography } from '../index';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';
import Divider from '@mui/material/Divider';

const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <>
      <Mobile>
        <footer className={cx('footer-section')}>
          <div className="footer-top pt-4 background-img-2">
            <div className="container">
              <div className="row justify-content-start">
                <div className="col-lg-3 mb-3 mb-lg-0">
                  <div className="footer-nav-wrap" style={{ marginLeft: 5 }}>
                    <ul className={cx('list-text-ul', 'list-unstyled')}>
                      <li className="mb-2 d-flex align-items-center">
                        <a href="#">
                          <Typography type="B1" weight="bold">
                            공지사항
                          </Typography>
                        </a>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <a href="#">
                          <Typography type="B1" weight="bold">
                            이용약관
                          </Typography>
                        </a>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <a href="#">
                          <Typography type="B1" weight="bold">
                            개인정보처리방침
                          </Typography>
                        </a>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <a href="#">
                          <Typography type="B1" weight="bold">
                            FAQ
                          </Typography>
                        </a>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <a href="#">
                          <Typography type="B1" weight="bold">
                            환불규정
                          </Typography>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <Divider sx={{ bgcolor: '#9a9ea7' }} component="li" />
                <div className="col-lg-2 mb-3 mb-lg-0">
                  <div className="footer-nav-wrap " style={{ marginLeft: 5 }}>
                    <ul className={cx('list-text', 'list-unstyled')}>
                      <li className="mb-2 d-flex align-items-center">
                        <Typography type="B1">회사명 : 라이프멘토스(주)</Typography>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <Typography type="B1">대표 : 추병조</Typography>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <Typography type="B1">사업자등록번호 : 530-86-02750</Typography>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <Typography type="B1">
                          {/*(주중 9시-18시/주말 및 공휴일 제외)*/}
                          {/*<br />*/}
                          주소 : 서울시 강남구 테헤란로2길 27, 12층 1224호
                        </Typography>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <Typography type="B1" weight="bold">
                          문의 : support@lifementors.co.kr
                        </Typography>
                      </li>
                      {/*<li className="d-flex align-items-center">*/}
                      {/*  <Typography type="B1" weight="bold">*/}
                      {/*    고객센터 : 02-000-0000*/}
                      {/*  </Typography>*/}
                      {/*</li>*/}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3 pb-3 footer-nav-wrap " style={{ textAlign: 'center' }}>
            <Typography type="B1">© 2023 커리어멘토스</Typography>
          </div>
        </footer>
      </Mobile>
      <div className="footer-bottom footer-border"></div>
      <Desktop>
        <footer className={cx('footer-section')}>
          <div className="footer-top pt-5 pb-5 background-img-2">
            <div className="container ">
              <div className="row tw-flex tw-items-center">
                <div className="col-lg-6 mb-3 mb-lg-0">
                  <div className="footer-nav-wrap tw-text-gray-800 tw-font-semibold">
                    <img
                      src="/assets/images/devus_footer.png"
                      alt="footer logo"
                      width={103}
                      className="img-fluid mb-5"
                    />
                    <ul className={cx('list-text', 'list-unstyled')}>
                      <li className="mb-2 d-flex align-items-center">
                        <Typography type="B2" weight="medium">
                          라이프멘토스(주) | 대표 : 추병조 | 서비스 문의 : support@lifementors.co.kr
                        </Typography>
                      </li>
                      <li className="mb-2 d-flex align-items-center">
                        <Typography type="B2">
                          서울시 강남구 테헤란로2길 27, 12층 1224호 | 사업자등록번호 : 530-86-02750
                        </Typography>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6 mb-3 mb-lg-0">
                  <div className="tw-grid tw-grid-cols-12 tw-gap-0 tw-p-0 ">
                    <div className="tw-col-span-3 tw-text-base tw-font-bold tw-text-gray-600">공지사항</div>
                    <div className="tw-col-span-3 tw-text-base tw-font-bold tw-text-gray-600">이용약관</div>
                    <div className="tw-col-span-4 tw-text-base tw-font-bold tw-text-gray-600">개인정보처리방침</div>
                    <div className="tw-col-span-2 tw-text-base tw-font-bold tw-text-gray-500">FAQ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className={cx('footer-section__container ')}>
              <div className={cx('footer-border', 'text-center justify-content-start')}>
                <p className="copyright-text pb-0 mb-0 ">
                  <Typography type="C2">
                    Copyright {new Date().getFullYear()}. LifeMentors Co., Ltd. all rights reserved.
                  </Typography>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </Desktop>
    </>
  );
};

export default Footer;
