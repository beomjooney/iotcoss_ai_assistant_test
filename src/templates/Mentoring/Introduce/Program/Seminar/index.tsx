import styles from './index.module.scss';
import classNames from 'classnames/bind';
import Banner from 'src/stories/components/Banner';
import { Button, Chip } from 'src/stories/components';

const cx = classNames.bind(styles);

export function MentorSeminarTemplate() {
  return (
    <div className={cx('mentor-seminar-container')}>
      <Banner title="커리어멘토" subTitle="커멘토 > 멘토 신청하기" imageName="top_banner_mentoring.svg" />
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
              <h2>입문 개발자들을 위한 꿀팁</h2>
              <p>
                What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book.
                <br />
                <br />
                It has survived not only five centuries, but also the leap into electronic typesetting, remaining
                essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
                Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including
                versions of Lorem Ipsum.
              </p>
            </div>
            <div className={cx('content__feature', 'content__item')}>
              <div className={cx('content__feature-intro')}>
                <h3>이런 분들께 추천해요</h3>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
            <hr />
            <div className={cx('content__seminar', 'content__item')}>
              <h2>세미나 진행내용</h2>
              <div>
                <h3>오프닝 [오프닝 소제목]</h3>
                <p>
                  What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                  but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in
                  the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
              </div>
              <div>
                <h3>강연 [강연 소제목]</h3>
                <p>
                  What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                  but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in
                  the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
              </div>
              <div>
                <h3>Q&A</h3>
                <p>
                  What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                  but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in
                  the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}

export default MentorSeminarTemplate;
