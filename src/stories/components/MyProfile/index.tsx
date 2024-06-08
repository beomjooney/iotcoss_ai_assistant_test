import classNames from 'classnames/bind';
import styles from './index.module.scss';
import Chip from '../Chip';
import { jobColorKey } from '../../../config/colors';
import Image from 'next/image';
import Link from 'next/link';
import { Typography } from '../index';
import Tooltip from '../Tooltip';

const cx = classNames.bind(styles);

const MyProfile = ({ profile }: any) => {
  return (
    <>
      <div className="tw-relative tw-rounded-[10px] border ">
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-start tw-absolute tw-left-[172px] tw-top-8 tw-gap-4">
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xl tw-text-left tw-text-black">
            <span className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xl tw-font-bold tw-text-left tw-text-black">
              {profile?.member?.nickname}
            </span>
            <span className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-xl tw-text-left tw-text-black">님</span>
          </p>
          <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-gap-2">
            <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-gap-2">
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-3 tw-py-1 tw-rounded tw-bg-[#d7ecff]">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#235a8d]">
                  {profile?.jobGroup?.name || 'N/A'}
                </p>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-3 tw-py-1 tw-rounded tw-bg-[#e4e4e4]">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#313b49]">
                  {profile?.job?.name || 'N/A'}
                </p>
              </div>
              <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-2.5 tw-px-3 tw-py-1 tw-rounded tw-bg-[#ffdede]">
                <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#b83333]">
                  {profile?.jobLevels?.name || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
            {profile?.member?.introduction || 'N/A'}
          </p>
        </div>
        <div className="tw-w-[120px] tw-h-[120px]" style={{ filter: 'drop-shadow(0px 2px 5px rgba(0,0,0,0.15))' }}>
          <div className="tw-left-[30.5px] tw-top-[30.5px]" />
          <div className="tw-w-[120px] tw-h-[127.85px] tw-mt-7 tw-ml-7 ">
            <img
              src={profile?.member?.profileImageUrl || 'https://via.placeholder.com/79x115'} // 디폴트 이미지 URL
              // src={'https://via.placeholder.com/79x115'} // 디폴트 이미지 URL
              className="border tw-rounded-full tw-w-[120px] tw-h-[120px] tw-object-cover"
            />
          </div>
        </div>
        <div className="tw-px-10 tw-mt-10">
          <p className=" tw-left-8 tw-top-[212px] tw-text-base tw-font-bold tw-text-left tw-text-black tw-py-2">
            Contact
          </p>
          <div className="tw-flex tw-flex-col tw-justify-start tw-items-start  tw-left-8 tw-top-[245px] tw-gap-1">
            <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                email:
              </p>
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                {profile?.email || 'N/A'}
              </p>
            </div>
            <div className="tw-flex tw-justify-start tw-items-start tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-font-medium tw-text-left tw-text-[#31343d]">
                phone:
              </p>
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-black">
                {profile?.phoneNumber || 'N/A'}
              </p>
            </div>
          </div>
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="tw-w-6 tw-h-6 tw-absolute tw-left-32 tw-top-32"
            preserveAspectRatio="none"
          >
            <circle cx={12} cy={12} r="11.5" fill="#9CA5B2" stroke="#CED4DE" />
            <path
              d="M14.9856 6.60537C15.1382 6.42488 15.3269 6.27796 15.5398 6.17398C15.7526 6.07001 15.9849 6.01125 16.2218 6.00146C16.4588 5.99168 16.6952 6.03107 16.916 6.11713C17.1368 6.2032 17.3371 6.33404 17.5042 6.50133C17.6713 6.66862 17.8015 6.86868 17.8865 7.08877C17.9715 7.30885 18.0095 7.54413 17.998 7.7796C17.9865 8.01508 17.9257 8.24559 17.8196 8.45644C17.7136 8.66729 17.5644 8.85385 17.3818 9.00424L9.29473 17.1004L6 18L6.89856 14.7016L14.9856 6.60537Z"
              fill="#E9ECF2"
            />
          </svg>
          <button className="tw-my-8 border tw-py-3 tw-px-5 tw-rounded tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-center tw-text-[#6a7380]">
            프로필 수정
          </button>
        </div>
      </div>
      <div className="tw-mt-7 tw-h-[320px] tw-relative tw-rounded-[10px] border tw-border-[#e0e4eb] tw-p-5">
        <div className="tw-text-black tw-text-base tw-font-bold">보유배지</div>
      </div>
    </>
  );
};

export default MyProfile;
