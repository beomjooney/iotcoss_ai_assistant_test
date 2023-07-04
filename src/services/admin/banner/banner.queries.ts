import { useQuery } from 'react-query';
import { getSeminarBanner } from './banner.api';
import { QUERY_KEY_FACTORY } from '../../queryKeys';

export const useBanners = () => useQuery([QUERY_KEY_FACTORY('ADMIN_BANNER').lists()], () => getSeminarBanner());
