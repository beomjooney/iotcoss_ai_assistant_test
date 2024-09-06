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

function getClubAboutStatus(status) {
  switch (status) {
    case '0200':
      return '클럽개설중 - 가입불가';
    case '0300':
      return '모집중 - 가입가능';
    case '0301':
      return '가입승인대기중';
    case '0302':
      return '가입거절 - 가입불가';
    case '0310':
      return '모집완료 - 가입불가 ';
    case '0210':
      return '연기 - 가입불가';
    case '0400':
      return '진행중 - 가입불가';
    case '0401':
      return '가입완료';
    case '0500':
      return '클럽종료 - 가입완료';
    case '0600':
      return '클럽강퇴 - 가입불가';
    default:
      return '모집 대기중';
  }
}

function getClubAboutJoyStatus(status) {
  switch (status) {
    case '0200':
      return '가입불가';
    case '0300':
      return '가입가능';
    case '0301':
      return '승인대기';
    case '0302':
      return '가입불가';
    case '0310':
      return '가입불가 ';
    case '0210':
      return '가입불가';
    case '0400':
      return '가입불가';
    case '0401':
      return '가입완료';
    case '0500':
      return '가입완료';
    case '0600':
      return '가입불가';
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

// utility.js
function getButtonClass(tenantName) {
  console.log('tenantName', tenantName);
  switch (tenantName) {
    case 'dsu':
      return 'tw-bg-[#e11837]';
    case 'iotcoss':
      return 'tw-bg-black';
    case 'abc':
      return 'tw-bg-green-500';
    // 더 많은 조건을 추가할 수 있습니다.
    default:
      return 'tw-bg-black';
  }
}

export { getClubStatusMessage, getButtonText, getClubAboutStatus, getClubAboutJoyStatus, getButtonClass };
