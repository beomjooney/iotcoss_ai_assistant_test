import { axiosGeneralAPI } from '../../index';

interface PushhistoryParamsProps {
  pushType: number;
  sendDateFrom: string;
  sendDateTo: string;
  page: number;
  size: number;
}
export async function getPushhistory(args: PushhistoryParamsProps) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/push-history', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}
