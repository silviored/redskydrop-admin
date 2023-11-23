import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';

export const getAll = async (params?: PaginationRequestApi) => {
  console.log(params)
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.COLORS.GET_ALL, {
      params
    });

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const get = async ({ id }: { id: string }) => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.COLORS.GET(id));

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const remove = async ({ id }: { id: string | number }) => {
  try {
    const responseGetAll = await apiInstance.delete(ENDPOINTS.COLORS.DELETE(id));

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const create = async (data: ColorRequestApi) => {
  try {
    const responseGetAll = await apiInstance.post(ENDPOINTS.COLORS.CREATE, data);

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const update = async (data: ColorRequestApi & { id: number}) => {
  try {
    const responseGetAll = await apiInstance.put(ENDPOINTS.COLORS.UPDATE(data.id.toString()), data);

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
