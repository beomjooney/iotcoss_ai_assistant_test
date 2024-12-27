import { useMemo } from 'react';

interface GroupLabels {
  groupLabel: string;
  subGroupLabel: string;
}

export const useGetGroupLabel = (jobGroupLabelType: string): GroupLabels => {
  return useMemo(() => {
    if (jobGroupLabelType === '0100') {
      return {
        groupLabel: '대학',
        subGroupLabel: '학과',
      };
    }
    return {
      groupLabel: '직군',
      subGroupLabel: '직무',
    };
  }, [jobGroupLabelType]);
};
