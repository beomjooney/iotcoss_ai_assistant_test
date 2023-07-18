import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Chip from '../Chip';
import { ArticleEnum, ArticleType } from 'src/config/types';
import { RecommendContent, SeminarContent } from 'src/models/recommend';
import { jobColorKey } from '../../../config/colors';
import Link from 'next/link';
import Image from 'next/image';
import { Desktop } from 'src/hooks/mediaQuery';

export type ArticleLikeUser = {
  userId: string;
  name: string;
  profileImageUrl: string;
};

export type Article = {
  articleId: number | string;
  title: string;
  boardId: number;
  boardName?: string;
  boardType?: string;
  hashtags?: string[]; //태그 리스트
  myLike?: boolean; // 내가 좋아요 눌렀는지 여부
  likeCnt?: number; //좋아요숫자
  likeUsers?: ArticleLikeUser[]; // 좋아요 유저리스트
  replyCnt?: number;
  viewCnt?: number;
  group?: string;
  name: string;
  userId: string;
  profileImageUrl?: string;
  body?: string; // html
  imageFileUrls?: string[];
  imageFiles?: string[];
  previewText?: string;
  previewImageUrl?: string;
  previewImageFilename?: string;
  createDate?: string;
  updateDate: string;
};

export interface ArticleCardProps {
  /** 콘텐츠 */
  content: Article;
  /** UI Type */
  uiType: ArticleType;
  /** bootstrap medium device size */
  mdSize?: string;
  /** className */
  className?: string;
}

const cx = classNames.bind(styles);

const QuizArticleCard = ({ content, uiType, mdSize = 'col-md-4', className }: ArticleCardProps) => {
  const numberWithCommas = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getPriceText = () => {
    const { paymentType, paymentTypeName, price } = content;
    if (paymentType === '0001') {
      // 무료
      return paymentTypeName;
    }
    return `${content.paymentTypeName} ${numberWithCommas(price)}원`;
  };

  const footerContent = () => {
    // TODO typeCode에 따라 구분 필요?
    if (uiType === ArticleEnum.VOD) {
      return (
        <>
          <div className={cx('footer--vod')}>
            {content.provider}
            <span className={cx('footer__price')}>{getPriceText()}</span>
          </div>
        </>
      );
    } else if (uiType === ArticleEnum.ARTICLE || uiType === ArticleEnum.SEMINAR) {
      return (
        <>
          <div className={cx('footer--topic')}>{content.provider}</div>
        </>
      );
    } else if (uiType === ArticleEnum.MENTOR_SEMINAR) {
      return (
        <>
          <div className={cx('footer--seminar')}>
            {content.lecturerName} 멘토
            <span className={cx('footer__price')}>{getPriceText()}</span>
          </div>
        </>
      );
    }
  };

  const hasContent = uiType === ArticleEnum.ARTICLE;
  const hasVod = uiType === ArticleEnum.VOD;
  const hasSeminar = uiType === ArticleEnum.SEMINAR;
  const isMentorSeminarType = uiType === ArticleEnum.MENTOR_SEMINAR;

  //세미나 마감 로직

  return (
    <div className={cx(className)}>
      <div
        // className={cx('article-card', 'card', 'border-0', 'shadow', 'text-left')}
        className={cx('article-card', 'card', 'text-left')}
        data-article={uiType === ArticleEnum.ARTICLE}
        data-vod={uiType === ArticleEnum.VOD}
        data-seminar={uiType === ArticleEnum.SEMINAR}
        data-mentor-seminar={uiType === ArticleEnum.MENTOR_SEMINAR}
      >
        <div>
          <div className={cx('img-area')}>
            {
              <Image
                src={
                  content.previewImageUrl?.indexOf('http') > -1
                    ? content.previewImageUrl
                    : `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${content.previewImageUrl}`
                }
                alt={`${content?.contentsTypeName} ${content?.contentsName}`}
                layout="fill"
                objectFit="fill"
                className={cx('img-area__image')}
                unoptimized={true}
              />
            }
            <div className={cx('img-area__chip')}>
              <Chip chipColor="primary" radius={4} style={{ zIndex: 999999 }}>
                레벨
              </Chip>

              <Chip chipColor="black" radius={4} style={{ zIndex: 999999, marginLeft: '10px' }}>
                마감임박
              </Chip>
            </div>
            {uiType === ArticleEnum.MENTOR_SEMINAR && (
              <>
                <div className={cx('img-area--gradient')} />
                <div className={cx('seminar-header')}>
                  <span className={cx('seminar-header__date')}>{seminarEndDateText}</span>
                  <span className={cx('seminar-header__status')}>{content.seminarStatusName}</span>
                </div>
              </>
            )}
          </div>
          <div className={cx('card-body')}>
            <Desktop>
              <p className={cx('category')}>
                {content.recommendJobGroups.length === 4 ? (
                  <Chip key={`job_all`} chipColor="primary" radius={4}>
                    모든 직군
                  </Chip>
                ) : (
                  content.recommendJobGroups.map((item, i) => (
                    <Chip key={`job_${i}`} chipColor={jobColorKey(item)} radius={4} variant="outlined">
                      {content.recommendJobGroupNames[i]}
                    </Chip>
                  ))
                )}
                <Chip chipColor="gray" radius={4} variant="outlined">
                  {contentTypeNm}
                </Chip>
                {hasContent && (
                  <div style={{ fontSize: 14, marginLeft: 10 }}>{articleData.toString().split(' ')[0]}</div>
                )}
                {(hasVod || hasSeminar) && (
                  <div style={{ fontSize: 14, marginLeft: 10 }}>{seminarStartData.toString().split(' ')[0]}</div>
                )}
                {/* {(hasContent || hasVod || hasSeminar) && (
                <div style={{ fontSize: 14, marginLeft: 10 }}>{content?.createdAt.toString().split(' ')[0]}</div>
              )} */}
              </p>
            </Desktop>
            <div
              className={cx({
                'article-card-content': true,
                'has-content': hasContent,
              })}
            >
              <h3 className={cx('article-card-content__title')}>
                {isMentorSeminarType ? content?.seminarTitle : content?.contentsName}
              </h3>
              {hasContent && <span className={cx('article-card-content__desc')}>{content.description}</span>}
            </div>
            <div className={cx('post-meta mb-2', 'article-card__tags')}>
              <ul className="list-inline meta-list">
                {content.keywords.map(tag => (
                  <li className="list-inline-item" key={tag}>
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <Desktop>
              <div className={cx('footer')}>{footerContent()}</div>
            </Desktop>
          </div>
        </div>
        {isMentorSeminarType ? (
          <Link href={`/seminar/${content.seminarId}`}>
            <div className={cx('article-card-desc', 'p-3', 'article-card--hover')}>
              <h3 className={cx('article-card-desc__title')}>{content?.seminarTitle}</h3>
              <p className={cx('article-card-desc__participant')}>강사: {content?.seminarLecturer?.name}</p>
              <p className={cx('article-card-desc__description')}>{content.description}</p>
            </div>
          </Link>
        ) : (
          <Link href={content.url}>
            <a target="_blank">
              <div className={cx('article-card-desc', 'p-3', 'article-card--hover')}>
                <h3 className={cx('article-card-desc__title')}>{content.contentsName}</h3>
                {uiType !== ArticleEnum.SEMINAR && (
                  <p className={cx('article-card-desc__participant')}>
                    {uiType === ArticleEnum.ARTICLE ? '저자' : '강사'}: {content.provider}
                  </p>
                )}
                <p className={cx('article-card-desc__description')}>{content.description}</p>
              </div>
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizArticleCard;
