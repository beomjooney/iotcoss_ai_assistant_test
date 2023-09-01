import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import { AuthError, ForbiddenError, LoginError } from './error';
import { reissueToken } from './account/account.api';
import { useSessionStore } from '../store/session';
import { UserInfo } from '../models/account';
import jwt_decode from 'jwt-decode';

interface RequestConfig extends AxiosRequestConfig {
  suppressStatusCode?: number[];
}

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: unknown, token = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

function createAxios(requestConfig: RequestConfig): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL: requestConfig.baseURL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true, // 백엔드 서버 설정 후 주석 해제(cors 쿠키 허용을 위해 필요)
  });

  axiosInstance.interceptors.request.use(
    async config => {
      config.headers = config.headers || {};
      const accessToken = getCookie('access_token');
      if (accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }

      return config;
    },
    error => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    response => {
      // console.log('API call successful: ', response.config.url);
      return response;
    },
    async error => {
      // console.error('API call failed: ', error.response.config?.url);
      const {
        config,
        response: { status, data },
      } = error;
      const originalConfig = config;
      if (status === 401) {
        const { update } = useSessionStore.getState();
        const userData: UserInfo = jwt_decode(process.env['NEXT_PUBLIC_GUEST_TOKEN']);
        update({
          logged: userData.sub !== 'Guest',
          memberType: userData.sub,
          memberId: userData.sub,
          memberName: userData.nickname,
          token: process.env['NEXT_PUBLIC_GUEST_TOKEN'],
          roles: userData.sub !== 'Guest' ? userData.roles : [],
        });
<<<<<<< HEAD
        // setCookie('access_token', process.env['NEXT_PUBLIC_GUEST_TOKEN']);
=======
        //setCookie('access_token', process.env['NEXT_PUBLIC_GUEST_TOKEN']);
>>>>>>> f36d69e053a92afeef1c24bd7e0aa037778593d9
        if (data.code === 'CO4007') throw new LoginError();
        throw new AuthError();
      }

      if (status === 404) {
        return Promise.reject(error.response.data || error);
      }

      if (status === 403) {
        throw new ForbiddenError();
        // if (isRefreshing) {
        //   return new Promise((resolve, reject) => {
        //     failedQueue.push({ resolve, reject });
        //   })
        //     .then(token => {
        //       originalConfig.headers['Authorization'] = `Bearer ${token}`;
        //       return axiosInstance(originalConfig);
        //     })
        //     .catch(error => {
        //       return Promise.reject(error?.response?.data || error);
        //     });
        // }
        //
        // originalConfig._retry = true;
        // isRefreshing = true;
        //
        // return new Promise((resolve, reject) => {
        //   reissueToken()
        //     .then(({ data: { accessToken: newAccessToken } }) => {
        //       axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        //       originalConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;
        //       setCookie('access_token', newAccessToken);
        //       processQueue(null, newAccessToken);
        //       resolve(axiosInstance(originalConfig));
        //     })
        //     .catch(error => {
        //       processQueue(error, null);
        //       reject(error?.response?.data || error);
        //     })
        //     .finally(() => {
        //       isRefreshing = false;
        //     });
        // });
      }

      return Promise.reject(error.response.data || error);
    },
  );

  return axiosInstance;
}

function camelCase(str: string) {
  return str.replace('/codes/', '').replace(/\b[/-]([a-z])/g, (_, char) => char.toUpperCase());
}

const axiosClient = createAxios({ baseURL: process.env['NEXT_PUBLIC_GENERAL_API_URL'] });

export const axiosSetHeader = (accessToken: string, userAgent: string, cookie: string) => {
  axiosClient.defaults.headers.common = {
    ...axiosClient.defaults.headers.common,
    Authorization: `Bearer ${accessToken}`,
    'User-Agent': userAgent,
    Cookie: cookie,
  };
};

export const axiosGeneralAPI = () => {
  axiosClient.defaults.baseURL = process.env['NEXT_PUBLIC_GENERAL_API_URL'];
  return axiosClient;
};

export default axiosClient;
