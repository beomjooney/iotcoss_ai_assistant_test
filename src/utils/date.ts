import dayjs from 'dayjs';

export const getDateString = (dateStr: string) => {
  return dateStr + (dateStr.length === 6 ? '01' : '');
};

export const getDateDiff = (startDate: string, endDate: string, dateUnit: any = 'M') => {
  return (
    dayjs(`${getDateString(endDate)}`).diff(dayjs(`${getDateString(startDate)}`), dateUnit) + (dateUnit === 'M' ? 1 : 0)
  );
};
