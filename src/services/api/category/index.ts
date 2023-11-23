import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';

export const getAll = async (params?: PaginationRequestApi) => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.CATEGORIES.GET_ALL, {
      params,
    });

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const get = async ({ id }: { id: string }) => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.CATEGORIES.GET(id));

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const create = async (data: CategoryRequestApi) => {
  try {
    const responseGetAll = await apiInstance.post(ENDPOINTS.CATEGORIES.CREATE, data);

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const update = async (data: CategoryRequestApi & { id: number}) => {
  try {
    const responseGetAll = await apiInstance.put(ENDPOINTS.CATEGORIES.UPDATE(data.id.toString()), data);

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
