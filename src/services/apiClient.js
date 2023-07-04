import axios from 'axios';
import ApiConfig from '../config/api-config';

const apiClient = axios.create({
  baseURL: ApiConfig.BASE_URL,
  headers: {
    Authorization: `Bearer ${ApiConfig.TOKEN}`,
  },
});

const reqResApiClient = axios.create({
  baseURL: ApiConfig.REQ_RES_BASE_URL,
});

export { apiClient, reqResApiClient };
