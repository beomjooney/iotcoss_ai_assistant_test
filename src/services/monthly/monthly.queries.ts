import { useQuery } from 'react-query';
import {
  getMonthlyRanking,
  getMonthlyQuizzes,
  getMonthlyMaker,
  getMonthlyMakerQuizzes,
  getMonthlyClubs,
  getCamenities,
} from './monthly.api';
import {
  MonthlyRankingResponse,
  MonthlyQuizzesResponse,
  MonthlyMakerResponse,
  MonthlyMakerQuizzesResponse,
  MonthlyClubsResponse,
} from 'src/models/monthly';
import { QUERY_KEY_FACTORY } from '../queryKeys';

export interface monthlyMakerParamProps {
  /*
    0001 : YEAR
    0002 : YEARMONTH
    0003 : DATE
  */
  statType: string;
  statDate: number;
  page?: number;
  size?: number;
}

export const useCamenities = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CAMENITY').list(params)], () => getCamenities(params));

export const useMonthlyRanking = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => getMonthlyRanking(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};

export const useMonthlyQuizzes = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => getMonthlyQuizzes(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};

export const useMonthlyMaker = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => getMonthlyMaker(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};

export const useMonthlyMakerQuizzes = (
  params?: monthlyMakerParamProps,
  onSuccess?: (data: MonthlyMakerQuizzesResponse) => void,
  onError?: (error: Error) => void,
) => {
  const DEFAULT_SIZE = 8;
  return useQuery<MonthlyMakerQuizzesResponse, Error>(
    QUERY_KEY_FACTORY('QUIZ').list({ size: DEFAULT_SIZE, ...params }),
    () => getMonthlyMakerQuizzes({ size: DEFAULT_SIZE, ...params }),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: true,
    },
  );
};

export const useMonthlyClubs = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => getMonthlyClubs(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};
