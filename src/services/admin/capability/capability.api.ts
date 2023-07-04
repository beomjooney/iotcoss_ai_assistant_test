import { axiosGeneralAPI } from '../../index';

interface CapabilitiesProps {
  page: number;
  size: number;
}
export async function getCapabilities(args: CapabilitiesProps) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/capabilities', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}
export const getCapability = async capabilityId => await axiosGeneralAPI().delete(`/capabilities/${capabilityId}`);

export const saveCapabilities = async (capabilityId, body) =>
  await axiosGeneralAPI().put(`/capabilities/${capabilityId}`, body);

export const deleteCapabilities = async capabilityId => await axiosGeneralAPI().delete(`/capabilities/${capabilityId}`);

export const addCapabilities = async body => await axiosGeneralAPI().post(`/capabilities`, body);
