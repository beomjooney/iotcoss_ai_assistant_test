import { useQuery } from 'react-query';
import { getQuizInfo, getQuizs } from './quiz.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useQuizs = params => useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').list(params)], () => getQuizs(params));

export const useQuiz = sequence =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').detail(sequence)], () => getQuizInfo(sequence), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
