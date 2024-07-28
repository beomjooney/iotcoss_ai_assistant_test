function getClubStatusMessage(status) {
  switch (status) {
    case '0200':
      return '대기중';
    case '0300':
      return '모집중';
    case '0301':
      return '가입승인대기중';
    case '0302':
      return '가입반려';
    case '0310':
      return '모집마감';
    case '0210':
      return '연기';
    case '0400':
      return '진행중';
    case '0401':
      return '퀴즈 풀기 화면으로 넘어가야 함';
    case '0500':
      return '완료';
    case '0600':
      return '종료';
    default:
      return '모집 대기중';
  }
}

const getButtonText = status => {
  switch (status) {
    case '0000':
      return '임시저장';
    case '0100':
      return '개설요청승인대기';
    case '0110':
      return '개설요청승인';
    case '0120':
      return '개설요청반려';
    case '0200':
      return '진행예정';
    case '0210':
      return '진행연기';
    case '0220':
      return '진행취소';
    case '0300':
      return '모집중';
    case '0310':
      return '모집마감';
    case '0400':
      return '진행중';
    case '0500':
      return '진행완료';
    default:
      return '없음'; // 기본값으로 알 수 없는 상태를 반환
  }
};

export { getClubStatusMessage, getButtonText };
