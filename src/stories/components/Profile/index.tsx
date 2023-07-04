import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Chip from '../Chip';
import { jobColorKey } from '../../../config/colors';
import Image from 'next/image';
import Link from 'next/link';
import { Typography } from '../index';
import Tooltip from '../Tooltip';

export interface ProfileProps {
  /** 멘토 정보 */
  mentorInfo: any;
  /** 색상: growthField 지정 시 직군 별 설정됨 */
  colorMode?: 'primary' | 'growthField';
  /** 하단 정보 노출 여부 */
  showDesc?: boolean;
  /** bootstrap small device size */
  smSize?: string;
  /** bootstrap large device size */
  lgSize?: string;
  /** custom className */
  className?: string;
  isLink?: boolean;
  isDetail?: boolean;
  imageSize?: number;
  weight?: 'regular' | 'medium' | 'bold';
  isOnlyImage?: boolean;
}

const cx = classNames.bind(styles);

const Profile = ({
  mentorInfo,
  colorMode = 'growthField',
  showDesc = false,
  smSize = 'col-sm-6',
  lgSize = 'col-lg-3',
  imageSize = 256,
  className,
  isDetail = false,
  weight = 'regular',
  isOnlyImage = false,
}: ProfileProps) => {
  const chipColor =
    colorMode === 'growthField' && mentorInfo?.jobGroupName ? jobColorKey(mentorInfo.jobGroup) : 'primary';
  const url = mentorInfo?.memberUri ? `/mentoring/${mentorInfo?.memberUri}` : '#';

  return (
    <Link href={url}>
      <div className={cx('profile', className)}>
        <div className={cx('profile-area')}>
          <div className={cx('profile-image')}>
            {mentorInfo?.profileImageUrl && (
              <Image
                src={
                  mentorInfo?.profileImageUrl.indexOf('http') > -1
                    ? mentorInfo?.profileImageUrl
                    : `${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${mentorInfo?.profileImageUrl}`
                }
                // src={`${process.env['NEXT_PUBLIC_GENERAL_API_URL']}/images/${mentorInfo?.profileImageUrl}`}
                alt={`${mentorInfo?.typeName} ${mentorInfo?.nickname}`}
                className={cx('rounded-circle', 'profile-image__image')}
                width={`${imageSize}px`}
                height={`${imageSize}px`}
                objectFit="cover"
                unoptimized={true}
              />
            )}
          </div>
          {!isOnlyImage && (
            <div className={cx('profile-area__chips')}>
              <Chip chipColor={chipColor} radius={4} variant="outlined">
                {mentorInfo?.jobGroupName}
              </Chip>
              <Chip chipColor={chipColor} radius={4} className="ml-2">
                {mentorInfo?.level}레벨
              </Chip>
            </div>
          )}
        </div>
        {!isOnlyImage && (
          <div className={cx({ 'profile-desc--show': showDesc }, 'profile-desc', 'mt-2')}>
            <Typography type="H2" tag="div" weight={weight} extendClass={cx('profile-desc__name', 'mb-0', 'mr-2')}>
              {mentorInfo?.nickname} {isDetail ? '멘토' : ''}
            </Typography>
            <Tooltip
              content={mentorInfo?.authenticatedYn ? '인증 멘토입니다.' : '일반 멘토입니다.'}
              placement="bottom"
              trigger="mouseEnter"
              warpClassName={cx('icon-height')}
              bgColor="lite-gray"
            >
              {mentorInfo?.authenticatedYn ? (
                <img src="/assets/images/icons/certified.svg" alt="인증멘토" />
              ) : (
                <img src="/assets/images/icons/uncertified.svg" alt="일반멘토" />
              )}
            </Tooltip>
            <Tooltip
              content={mentorInfo?.typeName}
              placement="bottom"
              trigger="mouseEnter"
              warpClassName={cx('icon-height')}
            >
              {mentorInfo?.type === '0002' && (
                <img src="/assets/images/level/Mento_lev1.svg" alt={mentorInfo?.typeName} />
              )}
            </Tooltip>
            <Tooltip
              content={mentorInfo?.typeName}
              placement="bottom"
              trigger="mouseEnter"
              warpClassName={cx('icon-height')}
            >
              {mentorInfo?.type === '0003' && (
                <img src="/assets/images/level/Mento_lev2.svg" alt={mentorInfo?.typeName} />
              )}
            </Tooltip>
            <Tooltip
              content={mentorInfo?.typeName}
              placement="bottom"
              trigger="mouseEnter"
              warpClassName={cx('icon-height')}
            >
              {mentorInfo?.type === '0004' && (
                <img src="/assets/images/level/Mento_lev3.svg" alt={mentorInfo?.typeName} />
              )}
            </Tooltip>
            <Tooltip
              content={mentorInfo?.typeName}
              placement="bottom"
              trigger="mouseEnter"
              warpClassName={cx('icon-height')}
            >
              {mentorInfo?.type === '0005' && (
                <img src="/assets/images/level/Mento_lev4.svg" alt={mentorInfo?.typeName} />
              )}
            </Tooltip>
            {/*<h6 className={cx('profile-desc__job')}>{mentorInfo?.jobGroupName}</h6> /!* TODO 확인 필요*!/*/}
          </div>
        )}
      </div>
    </Link>
  );
};

export default Profile;
