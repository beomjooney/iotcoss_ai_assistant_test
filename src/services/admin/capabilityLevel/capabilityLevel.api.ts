import { axiosGeneralAPI } from '../../index';

interface CapabilitiesProps {
  page: number;
  size: number;
}
export async function getCapabilitiesLevel(args: CapabilitiesProps) {
  let params = JSON.parse(JSON.stringify(args));
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || params[key] === undefined) {
      delete params[key];
    }
  });
  const { data, headers } = await axiosGeneralAPI().get('/capabilities/levels', { params });
  const totalPage = Number(headers['page-count']);
  return { data: data || [], nextPage: params.page + 1, totalPage };
}

export const getDetailCapabilitiesLevel = async capabilityId =>
  await axiosGeneralAPI().get(`/capabilities/${capabilityId}`);

export const saveCapabilitiesLevel = async (capabilityId, body) =>
  await axiosGeneralAPI().put(`/capabilities/${capabilityId}/levels`, body);

export const deleteCapabilitiesLevel = async capabilityId =>
  await axiosGeneralAPI().delete(`/capabilities/${capabilityId}/levels`);

export const addCapabilitiesLevel = async (capabilityId, body) =>
  await axiosGeneralAPI().post(`/capabilities/${capabilityId}/levels`, body);

export const getCapabilitiesBasedLevel = async capabilityId =>
  await axiosGeneralAPI().get(`/capabilities/${capabilityId}/levels`);
