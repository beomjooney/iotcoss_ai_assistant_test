import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Banner from 'src/stories/components/Banner';
import { Button, Chip } from 'src/stories/components';

const cx = classNames.bind(styles);

export function MentorGroupStudyTemplate() {
  return (
    <div className={cx('mentor-group-study-container')}>
      <Banner title="커리어멘토" imageName="top_banner_mentoring.svg" />
      <div className={cx('content-container', 'container pl-5 pr-5')}>
        <article>
          <section className={cx('info-container')}>
            <img src="/assets/img/blog/1.jpg" alt="image" />
            <div className={cx('info-area')}>
              <p className={cx('category')}>
                <Chip chipColor="primary" radius={4} variant="outlined" className="mr-1">
                  SW개발
                </Chip>
                <Chip chipColor="gray" radius={4} variant="outlined" className="mr-1">
                  Study
                </Chip>
                <Chip chipColor="primary" radius={4}>
                  0레벨 추천
                </Chip>
              </p>
              <h1>
                초보 개발자들 모여라 ! <br /> text here
              </h1>
              <p className={cx('info-area__mentor')}>홍길동 멘토</p>
              <div className={cx('info-area__desc')}>
                <p>일시 : 2022.00.00 ~ 2022.00.00</p>
                <p>시간 : 오후 7:00 이후</p>
                <p>과제 : 과제있음</p>
                <p>참여인원 : 16명</p>
              </div>
              <div className={cx('info-area__tags')}>
                <span className={cx('info-area__tags-item')}>#개발</span>
                <span className={cx('info-area__tags-item')}>#입문</span>
                <span className={cx('info-area__tags-item')}>#html</span>
              </div>
              <Button color="primary" label="멘토 스터디 참여 신청하기" />
              <span className={cx('info-area__status')}>모집 중</span>
            </div>
          </section>
          <hr />
          <section className={cx('content')}>
            <div className={cx('content__intro', 'content__item')}>
              <h2>초보 개발자들 모여라!</h2>
              <p>
                What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in
                the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
                desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
            </div>
            <div className={cx('content__feature', 'content__item')}>
              <div className={cx('content__feature-intro')}>
                <h3>스터디 간단 소개 및 특징</h3>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
              <div className={cx('feature-item-container')}>
                <div className={cx('feature-item')}>
                  <img src="/assets/img/blog/1.jpg" alt="image" />
                  <div className={cx('feature-item__info')}>
                    <h4>스터디 소개</h4>
                    <p>
                      What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type specimen book. It has survived not
                      only five centuries, but also the leap into electronic typesetting, remaining essentially
                      unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including
                      versions of Lorem Ipsum.
                    </p>
                  </div>
                </div>
                <div className={cx('feature-item')}>
                  <img src="/assets/img/blog/1.jpg" alt="image" />
                  <div className={cx('feature-item__info')}>
                    <h4>스터디 소개</h4>
                    <p>
                      What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type specimen book. It has survived not
                      only five centuries, but also the leap into electronic typesetting, remaining essentially
                      unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including
                      versions of Lorem Ipsum.
                    </p>
                  </div>
                </div>
                <div className={cx('feature-item')}>
                  <img src="/assets/img/blog/1.jpg" alt="image" />
                  <div className={cx('feature-item__info')}>
                    <h4>스터디 소개</h4>
                    <p>
                      What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type specimen book. It has survived not
                      only five centuries, but also the leap into electronic typesetting, remaining essentially
                      unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including
                      versions of Lorem Ipsum.
                    </p>
                  </div>
                </div>
              </div>
              <div className={cx('content__change', 'content__item')}>
                <h3>스터디를 하면 생기는 변화</h3>
                <p>
                  What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                  but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in
                  the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
              </div>
              <div className={cx('content__table', 'content__item')}>
                <h3>스터디 일정표</h3>
                <div className={cx('table-item')}>
                  <div className={cx('table-item__time')}> 00.00(월) </div>
                  <div className={cx('table-item__desc')}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </div>
                </div>
                <div className={cx('table-item')}>
                  <div className={cx('table-item__time')}> 00.00(월) </div>
                  <div className={cx('table-item__desc')}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}

export default MentorGroupStudyTemplate;
