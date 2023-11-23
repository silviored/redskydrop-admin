import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';

export const create = async (data: UserRequestApi) => {
  try {
    const responseCreate = await apiInstance.post(ENDPOINTS.USERS.CREATE, data);

    return responseCreate.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const update = async ({id, ...rest}: Partial<UserRequestApi> & { id: string | number }) => {
  try {
    const responseUpdate = await apiInstance.put(ENDPOINTS.USERS.UPDATE(id), rest);

    return responseUpdate.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const getAll = async (params?: PaginationRequestApi & ProductFilterProps) => {
  try {
    const responseGetAll = await apiInstance.get(
      ENDPOINTS.USERS.GET_ALL, {
        params,
      });

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const reportDashboard = async () => {
  try {
    const responseGetAll = await apiInstance.get(
      ENDPOINTS.USERS.REPORT_DASHBOARD);

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const get = async ({ id }: { id: string }) => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.USERS.GET(id));

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
