import dayjs from 'dayjs';

export const getDateString = (dateStr: string) => {
  return dateStr + (dateStr.length === 6 ? '01' : '');
};

export const getDateDiff = (startDate: string, endDate: string, dateUnit: any = 'M') => {
  return (
    dayjs(`${getDateString(endDate)}`).diff(dayjs(`${getDateString(startDate)}`), dateUnit) + (dateUnit === 'M' ? 1 : 0)
  );
};

export function getFirstSubdomain() {
  const { host } = typeof window !== 'undefined' && window.location;

  if (host) {
    // 'localhost'를 제외하고, 최소한 두 개의 부분을 가진 경우에만 처리
    if (!host.includes('.')) {
      return 'b2c'; // 공백 반환
    }
    // 호스트 이름을 점(.)으로 분리하고 첫 번째 부분을 반환
    return host.split('.')[0];
  }
  return null; // host가 없는 경우
}
