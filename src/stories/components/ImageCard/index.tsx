import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Chip, Typography } from '../index';

export interface ImageCardProps {
  /** 이미지 경로 */
  src: string;
  /** chip 목록 */
  labels?: any[];
  /** 모집 여부 */
  isRecruit: boolean;
  /** 카드 타이틀 */
  title: string;
  /** 태그 목록 */
  tags: any[];
  /** 멘토이름 */
  mentorName: string;
  /** 스터디 인원 */
  studyCount: number;
}

const cx = classNames.bind(styles);

const ImageCard = ({
  src = 'assets/img/blog/1.jpg',
  labels = ['SW개발', '스터디', '1레벨 추천'],
  isRecruit,
  title = '모여라 개발자들이여',
  tags = ['개발', '입문', '백엔드개발'],
  mentorName = '추병조',
  studyCount = 0,
}: ImageCardProps) => {
  return (
    <div className={cx('image-card-container')}>
      <div className={cx('card-area', 'single-blog-card card border-0 shadow-sm')}>
        <img src={src} width={192} alt="blog" />
        <div className="card-body">
          <div className={cx('chip-group')}>
            {labels?.map((label, index) => {
              return (
                <Chip key={`chip-${index}`} chipColor="primary" radius={4} variant="outlined">
                  {label}
                </Chip>
              );
            })}
            <Typography type="H3" extendClass={cx('text__override')} weight="bold">
              {isRecruit ? '모집중' : '종료'}
            </Typography>
          </div>
          <div className="post-meta mb-2">
            <Typography type="H3" tag="p" extendClass={cx('title__override')} weight="bold">
              {title}
            </Typography>
          </div>
          <div className="post-meta">
            {tags?.map((tag, index) => {
              return (
                <Typography key={`tag-${index}`} type="B2">
                  #{tag}
                </Typography>
              );
            })}
          </div>
          <Typography type="B2" extendClass={cx('mentor__override')} weight="bold">
            {mentorName} 멘토
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
