import { useQuery } from 'react-query';
import { getQuizInfo, getQuizs } from './quiz.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useQuizs = params => useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').list(params)], () => getQuizs(params));

export const useQuiz = quizId =>
  useQuery([QUERY_KEY_FACTORY('ADMIN_MEMBERS').detail(quizId)], () => getQuizInfo(quizId), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
