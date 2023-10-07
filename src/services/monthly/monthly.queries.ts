import { useQuery } from 'react-query';
import {
  monthlyRanking,
  monthlyQuizzes,
  monthlyMaker,
  monthlyMakerQuizzes,
  monthlyClubs,
  getCamenities,
} from './monthly.api';
import { QUERY_KEY_FACTORY } from '../queryKeys';

export const useCamenities = params =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_CAMENITY').list(params)], () => getCamenities(params));

export const useMonthlyRanking = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => monthlyRanking(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};

export const useMonthlyQuizzes = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => monthlyQuizzes(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};

export const useMonthlyMaker = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => monthlyMaker(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};

export const useMonthlyMakerQuizzes = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => monthlyMakerQuizzes(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};

export const useMonthlyClubs = (onSuccess?: (data: any) => void, onError?: (error: Error) => void) => {
  return useQuery<any, Error>(QUERY_KEY_FACTORY('QUIZ').lists(), () => monthlyClubs(), {
    onSuccess,
    onError,
    // refetchOnWindowFocus: false,
  });
};
