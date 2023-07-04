import styles from './index.module.scss';
import classNames from 'classnames/bind';
import SectionHeader from 'src/stories/components/SectionHeader';
import { Typography } from '../../stories/components';
import Banner from 'src/stories/components/Banner';
import { Desktop, Mobile } from 'src/hooks/mediaQuery';

const cx = classNames.bind(styles);

export function BusinessTemplate() {
  return (
    <div className={cx('business-container')}>
      <section className="hero-section hero-section-3">
        <Mobile>
          <Banner title="커리어멘토스 소개합니다." subTitle="커멘소개" imageName="top_banner_introduce.svg" />
        </Mobile>
        <Desktop>
          <Banner title="커리어멘토스 소개" subTitle="커멘소개" imageName="top_banner_introduce.svg" />
        </Desktop>
      </section>
      <article className="pt-100">
        <div className={cx('container')} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
          <div className="row justify-content-center">
            <div className="section-heading">
              <section>
                <Desktop>
                  <SectionHeader title="커리어멘토스를 소개합니다." subTitle="OUR SERVICE" />
                </Desktop>
                <Mobile>
                  <img
                    className={cx('object-img')}
                    src="/assets/images/business/cm01.svg"
                    alt="커리어멘토스 서비스 소개 이미지"
                  />
                </Mobile>
                <div className={cx('business-card')}>
                  <Desktop>
                    <img
                      className={cx('object-img')}
                      src="/assets/images/business/cm01.svg"
                      alt="커리어멘토스 서비스 소개 이미지"
                    />
                  </Desktop>
                  <div className={cx('business-text')}>
                    <Typography type="H3" tag="div" extendClass={cx('business-container__override')}>
                      최적의 성장 루트를 알려드려요!
                    </Typography>
                    <div style={{ color: '#5E6775' }}>
                      커리어멘토스는 직무 전문성/성장에 대해 고민 중인 분들을 위한 서비스입니다.
                      <br />
                      나의 성향과 역량에 맞는 목표모델을 찾고, 목표모델로 성장하기 위한 다양한 방법을 제공받을 수
                      있습니다. 또한, 직무상 목표모델로 성장한 멘토들의 커리어세미나 통해 실질적으로 도움이 되는 성장
                      스토리 및 노하우를 전달받을 수 있습니다.
                      <br />
                      초기에는 IT 분야 커리어에 집중하여 운영할 예정이지만, 점진적으로 다양한 산업분야 커리어를 위한
                      서비스로 발전해 나갈 예정입니다.
                    </div>
                  </div>
                </div>
              </section>
              <section className={cx('mt-92')}>
                <SectionHeader title="멘티님에게 드리는 말씀" subTitle="TO MENTEE" />
                <Mobile>
                  <img
                    className={cx('object-img')}
                    src="/assets/images/business/cm03.svg"
                    alt="커리어멘토스 서비스 소개 이미지"
                  />
                </Mobile>
                <div className={cx('business-cm3')}>
                  <Desktop>
                    <img
                      className={cx('object-img')}
                      src="/assets/images/business/cm03.svg"
                      alt="커리어멘토스 서비스 소개 이미지"
                    />
                  </Desktop>
                  <div className={cx('business-text-cm3')}>
                    <Typography type="H3" tag="div" extendClass={cx('business-container__override')}>
                      답답하고 외로우시죠? 함께 할게요!
                    </Typography>
                    <div style={{ color: '#5E6775' }}>
                      커리어멘토스를 통해서 직무 목표모델을 찾고, 성장에 대한 고민을 조금이라도 해결하기를 기대합니다.
                      <br />
                      주니어, 시니어 모두 커리어 고민이 되는 것은 당연한 것입니다. 응답하라 1988 드라마 "아빠도 아빠가
                      처음이라 미안해"라는 대사처럼 우리 모두 신입사원, 실무자, 팀리더가 처음이기 때문입니다.
                      <br />
                      선한 영향력을 가진 멘토님들 만남을 통해 직무별 전문가로 성장하였으면 합니다. 그리고 커리어멘토스가
                      아니더라도 따스함을 전파하는 멘토로서 활동하기를 기대합니다.
                    </div>
                  </div>
                </div>
              </section>

              <section className={cx('mt-92')}>
                <SectionHeader title="멘토님에게 드리는 말씀" subTitle="TO MENTOR" />
                <Mobile>
                  <img
                    className={cx('object-img')}
                    src="/assets/images/business/cm02.svg"
                    alt="커리어멘토스 서비스 소개 이미지"
                  />
                </Mobile>
                <div className={cx('business-cm2')}>
                  <Desktop>
                    <img
                      className={cx('object-img')}
                      src="/assets/images/business/cm02.svg"
                      alt="커리어멘토스 서비스 소개 이미지"
                    />
                  </Desktop>
                  <div className={cx('business-text-cm2')}>
                    <Typography type="H3" tag="div" extendClass={cx('business-container__override')}>
                      선한 영향력을 펼치고, 인맥을 넓혀보세요!
                    </Typography>
                    <div style={{ color: '#5E6775' }}>
                      커리어멘토스는 멘토님들의 따스함을 세상에 전파하는 것을 목표로 하고 있습니다.
                      <br />
                      좋은 성장경험을 나누고 싶어하는 멘토님들과 함께 하고 싶습니다. 주니어들에게는 실무리더의 최근 좋은
                      성장경험이 업계유명인보다 현실적으로 도움이 될 수 있습니다.
                      <br />
                      실무리더 멘토의 경우 그룹리더/C레벨리더 커리어세미나를 통해 리더로서 성장에 대한 현실적인 조언을
                      들을 수 있습니다. 또한, 멘토 모임을 통해 다양한 직군/도메인에 대한 인사이트 확대를 지원 드릴
                      예정입니다.
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          {/*<div className="row justify-content-center ptb-100">*/}
          {/*  <div className={cx('col-md-12')}>*/}
          {/*    <div className="section-heading text-center">*/}
          {/*      <SectionHeader title="커리어멘토스 서비스 소개 영상" subTitle="OUR SERVICE" />*/}
          {/*      <div className="row col-lg-12 mt-lg-5 text-center">*/}
          {/*        <Typography type="H2">서비스 준비중</Typography>*/}
          {/*        <PlayerYoutube videoId="JAHwbhES0EI" />*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </article>
    </div>
  );
}

export default BusinessTemplate;
