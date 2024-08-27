import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { BoardType, ReplyType } from 'src/config/entities';
import React, { useEffect, useRef, useState } from 'react';
import { User } from 'src/models/user';
import { useSessionStore } from 'src/store/session';
const { logged } = useSessionStore.getState();
import Grid from '@mui/material/Grid';
import { useMyReplyDelete } from 'src/services/community/community.mutations';
import { useMyReplyUpdate } from 'src/services/community/community.mutations';

const cx = classNames.bind(styles);

const ReplyCard = ({ item, refetch }) => {
  const { memberId } = useSessionStore.getState();
  const [isTextModify, setIsTextModify] = useState(false);
  const [text, setText] = useState('');
  const textInput = useRef(null);

  const { mutate: onMyReplyDelete, isSuccess: deleteReplySuccess } = useMyReplyDelete();
  const { mutate: onMyReplyUpdate, isSuccess: updateReplySuccess } = useMyReplyUpdate();

  const handleTextChange = event => {
    setText(event.target.value);
  };

  useEffect(() => {
    if (deleteReplySuccess) {
      refetch();
    }
  }, [deleteReplySuccess]);

  const handleModify = (item: any) => {
    console.log(item);
    setIsTextModify(true);
    // setText(item.text);
  };

  const handleDelete = (item: any) => {
    // TODO 삭제 처리
    if (confirm('나의 댓글을 삭제하시겠습니까?')) {
      console.log(item.answerReplySequence);
      onMyReplyDelete({ answerReplySequence: item?.answerReplySequence, body: text });
    }
  };

  const handleCancel = (item: any) => {
    setIsTextModify(false);
  };

  const handleSave = (item: any) => {
    setIsTextModify(false);
    console.log(text);
    onMyReplyUpdate({ answerReplySequence: item?.answerReplySequence, body: text });
    //
  };

  useEffect(() => {
    setText(item?.text);
  }, [item]);

  return (
    <div className="tw-mb-5">
      <div className=" tw-py-2">
        <span className="tw-font-bold tw-text-sm tw-text-black">{item.clubName}</span>{' '}
        <span className="tw-text-sm tw-text-black">{item.clubDescription}</span>
      </div>
      <div className="border tw-rounded-lg tw-p-5">
        <Grid
          className=" tw-mb-3"
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          rowSpacing={0}
        >
          <Grid item xs={2}>
            <div className="tw-flex tw-gap-3 tw-items-center">
              <img
                className="tw-object-cover tw-w-10 tw-h-10 border tw-rounded-full "
                src={item?.member?.profileImageUrl}
                alt=""
              />
              <div className="tw-font-bold tw-font-base tw-text-black">{item?.member?.nickname || 'N/A'}</div>
            </div>
          </Grid>
          <Grid item xs={7}>
            <div className="tw-mb-0 tw-text-sm tw-font-normal tw-text-gray-500 dark:tw-text-gray-400">
              <div className="tw-flex tw-gap-3">
                <div className="tw-bg-[#d7ecff] tw-rounded-[3.5px] tw-px-[10.5px] ">
                  <p className="tw-text-[12.25px] tw-text-[#235a8d]">{item?.jobGroup?.name || 'N/A'}</p>
                </div>
                <div className="tw-bg-[#e4e4e4] tw-rounded-[3.5px] tw-px-[10.5px]">
                  <p className="tw-text-[12.25px] tw-text-[#313b49]">{item?.jobLevel?.name || 'N/A'}</p>
                </div>
                <div className="tw-bg-[#ffdede] tw-rounded-[3.5px] tw-px-[10.5px] ">
                  <p className="tw-text-[12.25px] tw-text-[#b83333]">{item?.job?.name || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="tw-flex tw-justify-end">
              <div className="tw-text-sm tw-text-gray-500">{item?.repliedAt}</div>
            </div>
          </Grid>
        </Grid>
        {isTextModify ? (
          <textarea
            value={text}
            className="tw-form-control tw-w-full tw-py-[8px] tw-p-5 tw-text-sm"
            id="floatingTextarea"
            placeholder="댓글을 입력해주세요."
            ref={textInput}
            rows={2} // 두 줄 높이로 설정
            onChange={handleTextChange}
          ></textarea>
        ) : (
          <div className="tw-text-sm tw-text-gray-500 tw-py-5">{text}</div>
        )}

        <div className="tw-flex tw-justify-between tw-items-center tw-relative tw-gap-2">
          <div className="tw-flex tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0 tw-relative tw-gap-1">
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M10 16.4947C9.5485 16.1135 9.0382 15.7171 8.4985 15.2953H8.4915C6.59101 13.816 4.43711 12.1422 3.48581 10.1366C3.17328 9.49803 3.00765 8.80332 3.00001 8.09893C2.99792 7.13241 3.40515 6.20588 4.12968 5.52874C4.8542 4.8516 5.83486 4.48102 6.85001 4.50075C7.67645 4.50199 8.48509 4.72935 9.1796 5.15575C9.48478 5.3443 9.7609 5.57238 10 5.83341C10.2404 5.5734 10.5166 5.34546 10.8211 5.15575C11.5153 4.72927 12.3238 4.50189 13.15 4.50075C14.1651 4.48102 15.1458 4.8516 15.8703 5.52874C16.5948 6.20588 17.0021 7.13241 17 8.09893C16.9928 8.80445 16.8272 9.50035 16.5142 10.1399C15.5629 12.1455 13.4097 13.8187 11.5092 15.2953L11.5022 15.3006C10.9618 15.7197 10.4522 16.1162 10.0007 16.5L10 16.4947ZM6.85001 5.83341C6.19797 5.82564 5.56906 6.06319 5.10001 6.49441C4.64808 6.91697 4.3955 7.49593 4.39995 8.09893C4.40794 8.61233 4.53009 9.11831 4.75841 9.58351C5.20747 10.4489 5.81339 11.232 6.54831 11.897C7.24201 12.5633 8.04 13.2083 8.7302 13.7507C8.9213 13.9007 9.1159 14.0519 9.3105 14.2032L9.433 14.2985C9.6199 14.4437 9.8131 14.5943 10 14.7422L10.0091 14.7342L10.0133 14.7309H10.0175L10.0238 14.7262H10.0273H10.0308L10.0434 14.7162L10.0721 14.6943L10.077 14.6903L10.0847 14.6849H10.0889L10.0952 14.6796L10.56 14.3164L10.6818 14.2212C10.8785 14.0686 11.0731 13.9173 11.2642 13.7674C11.9544 13.225 12.7531 12.5807 13.4468 11.911C14.1818 11.2464 14.7878 10.4634 15.2367 9.59817C15.4691 9.12894 15.593 8.61767 15.6 8.09893C15.6029 7.49779 15.3505 6.92105 14.9 6.49974C14.4318 6.06657 13.8028 5.82707 13.15 5.83341C12.3533 5.82696 11.5918 6.14483 11.057 6.70696L10 7.86638L8.943 6.70696C8.40825 6.14483 7.64666 5.82696 6.85001 5.83341Z"
                fill="#E11837"
              ></path>
            </svg>
            <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#313b49]">
              {item?.likeCount}
            </p>
          </div>
          <div className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-8 tw-h-[21px]">
            <div className="tw-flex tw-justify-start tw-items-center tw-absolute tw-left-12 tw-top-0 tw-gap-1">
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="tw-flex-grow-0 tw-flex-shrink-0 tw-w-5 tw-h-5 tw-relative"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M4.28596 13.4481L4.98596 13.5917C5.0186 13.4317 4.99541 13.2653 4.92025 13.1203L4.28596 13.4481ZM7.05239 16.2146L7.38025 15.5803C7.23524 15.5051 7.06885 15.4819 6.90882 15.5146L7.05239 16.2146ZM3.57168 16.9289L2.87168 16.7853C2.84799 16.9011 2.85339 17.0209 2.88741 17.1341C2.92143 17.2473 2.983 17.3502 3.0666 17.4338C3.1502 17.5173 3.25322 17.5788 3.36643 17.6127C3.47963 17.6466 3.59949 17.6519 3.71525 17.6281L3.57168 16.9289ZM15.7145 10.5003C15.7145 12.0158 15.1125 13.4693 14.0409 14.5409C12.9692 15.6125 11.5158 16.2146 10.0002 16.2146V17.6431C13.9452 17.6431 17.1431 14.4453 17.1431 10.5003H15.7145ZM4.28596 10.5003C4.28596 8.98476 4.888 7.53131 5.95964 6.45967C7.03128 5.38803 8.48473 4.78599 10.0002 4.78599V3.35742C6.05525 3.35742 2.85739 6.55528 2.85739 10.5003H4.28596ZM10.0002 4.78599C11.5158 4.78599 12.9692 5.38803 14.0409 6.45967C15.1125 7.53131 15.7145 8.98476 15.7145 10.5003H17.1431C17.1431 6.55528 13.9452 3.35742 10.0002 3.35742V4.78599ZM4.92025 13.1203C4.50188 12.3104 4.28434 11.4118 4.28596 10.5003H2.85739C2.85739 11.6796 3.14311 12.7939 3.65168 13.776L4.92025 13.1203ZM10.0002 16.2146C9.08872 16.216 8.19019 15.9985 7.38025 15.5803L6.72453 16.8489C7.73707 17.3721 8.86049 17.6445 10.0002 17.6431V16.2146ZM3.58596 13.3046L2.87168 16.7853L4.27168 17.0724L4.98596 13.5917L3.58596 13.3046ZM3.71525 17.6281L7.19596 16.9146L6.90882 15.5146L3.42811 16.2289L3.71525 17.6281Z"
                  fill="#313B49"
                ></path>
                <path
                  d="M7.85718 9.07227H12.1429"
                  stroke="#313B49"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M7.85718 11.9297H12.1429"
                  stroke="#313B49"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <p className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#313b49]">
                {item?.replyCount}
              </p>
            </div>
          </div>
          <div className="tw-flex tw-justify-end tw-items-start tw-relative tw-gap-3">
            {isTextModify ? (
              <div className="tw-flex tw-justify-end tw-items-start tw-relative tw-gap-3">
                <button
                  onClick={() => {
                    handleSave(item);
                  }}
                  className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#e11837]"
                >
                  저장하기
                </button>
                <button
                  onClick={() => {
                    handleCancel(item);
                  }}
                  className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#31343d]"
                >
                  취소하기
                </button>
              </div>
            ) : (
              <div className="tw-flex tw-justify-end tw-items-start tw-relative tw-gap-3">
                <button
                  onClick={() => {
                    handleModify(item);
                  }}
                  className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#e11837]"
                >
                  수정하기
                </button>
                <button
                  onClick={() => {
                    handleDelete(item);
                  }}
                  className="tw-flex-grow-0 tw-flex-shrink-0 tw-text-sm tw-text-left tw-text-[#31343d]"
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;
