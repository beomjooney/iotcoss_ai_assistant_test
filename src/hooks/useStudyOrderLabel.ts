import { useMemo } from 'react';

interface StudyOrderLabels {
  studyOrderLabel: string;
}

export const useStudyOrderLabel = (studyOrderLabelType: string): StudyOrderLabels => {
  return useMemo(() => {
    if (studyOrderLabelType === '0100') {
      return {
        studyOrderLabel: '주차',
      };
    }
    return {
      studyOrderLabel: '회차',
    };
  }, [studyOrderLabelType]);
};
