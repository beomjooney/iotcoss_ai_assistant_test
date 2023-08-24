import { useQuery } from 'react-query';
import { CodeResponse } from 'src/models/code';
import { QUERY_KEY_FACTORY } from '../queryKeys';
import { codeDetailList, getCodeList } from './code.api';

enum CODE {
  CODE_GROUP_GROWTH_FIELD = '0001',
  CODE_GORUP_JOBS = '0002',
  CODE_GROWTH_EDGE_TYPES = '0003',
  CODE_EDGE_RECOMMEND_TYPES = '0004',
  CODE_GROUP_PATMENT_TYPES = '0006',
  CODE_CONTENT_TYPES = '1101',
  CODE_SEMINAR_PLACE_TYPES = '0014',
  CODE_MEMBER_TYPES = '0011',
  CODE_SEMINAR_TYPE = '0012',
  CODE_SEMINAR_STATUS = '0015',
  CODE_SERVICE_TYPE = '0007',
  CODE_SERVICE_DETAIL_TYPES = '0008',
  CODE_PRICE_LEVEL = '0009',
  CODE_RECOMMEND_LEARNING_GROWTH_TENDENCIES = '0010',
  CODE_PUSH_TYPE = '0020',
  CODE_SEND_STATUS = '0019',
}
const CODE_GROUP_GROWTH_FIELD = '0001';
const CODE_GROUP_PATMENT_TYPES = '0006';
const CODE_CONTENT_TYPES = '0005';
const CODE_SEMINAR_PLACE_TYPES = '0014';

export const useContentTypes = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_CONTENT_TYPES, onSuccess, onError);
};

export const useJobGroups = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails('', onSuccess, onError);
  return useCodeDetails(CODE.CODE_GROUP_GROWTH_FIELD, onSuccess, onError);
};

export const usePaymentTypes = (onSuccess: (data: CodeResponse) => void, onError: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_GROUP_PATMENT_TYPES, onSuccess, onError);
};

export const usePlaceTypes = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_SEMINAR_PLACE_TYPES, onSuccess, onError);
};

export const useMemberCode = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_MEMBER_TYPES, onSuccess, onError);
};

export const useSeminarTypes = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_SEMINAR_TYPE, onSuccess, onError);
};

export const useSeminarStatus = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_SEMINAR_STATUS, onSuccess, onError);
};

export const useSeminarPaymentTypes = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_GROUP_PATMENT_TYPES, onSuccess, onError);
};

export const useServicePriceGrade = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_PRICE_LEVEL, onSuccess, onError);
};

export const useServiceType = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_SERVICE_TYPE, onSuccess, onError);
};

export const useRecommendLearningGrowth = (
  onSuccess?: (data: CodeResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useCodeDetails(CODE.CODE_RECOMMEND_LEARNING_GROWTH_TENDENCIES, onSuccess, onError);
};

export const useJobs = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_GORUP_JOBS, onSuccess, onError);
};

export const useServiceDetails = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_SERVICE_DETAIL_TYPES, onSuccess, onError);
};

export const usePush = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_PUSH_TYPE, onSuccess, onError);
};

export const useSendStatus = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_SEND_STATUS, onSuccess, onError);
};

export const useEdgeTypes = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_GROWTH_EDGE_TYPES, onSuccess, onError);
};

export const useEdgeRecommendTypes = (onSuccess?: (data: CodeResponse) => void, onError?: (error: Error) => void) => {
  return useCodeDetails(CODE.CODE_EDGE_RECOMMEND_TYPES, onSuccess, onError);
};

export const useCodeDetails = (
  groupId: string,
  onSuccess?: (data: CodeResponse) => void,
  onError?: (error: Error) => void,
) => {
  return useQuery<CodeResponse, Error>(
    QUERY_KEY_FACTORY('CODE_DETAILS').list({ groupId }),
    () => codeDetailList(groupId),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10분 유지
    },
  );
};

export const useCodeList = params => {
  return useQuery([QUERY_KEY_FACTORY('ADMIN_CODE_LIST').list(params)], () => getCodeList(params));
};
