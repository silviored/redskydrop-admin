import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';

export const getAll = async (params?: PaginationRequestApi & ProductFilterProps) => {
  try {
    const responseGetAll = await apiInstance.get(
      ENDPOINTS.PRODUCTS.GET_ALL, {
        params,
      });

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const create = async (data: FormData) => {
  try {
    const responseGetAll = await apiInstance.post(
      ENDPOINTS.PRODUCTS.GET_ALL, data);

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const removeUpload = async ({ url, id }: { url: string; id: number }) => {
  try {
    const responseGetAll = await apiInstance.post(
      ENDPOINTS.PRODUCTS.REMOVE_UPLOAD(id), { url });

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const update = async (data: FormData, id: string) => {
  try {
    const responseGetAll = await apiInstance.put(ENDPOINTS.PRODUCTS.UPDATE(id), data);

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const get = async ({ id }: { id: string }) => {
  try {
    const responseGetAll = await apiInstance.get(
      ENDPOINTS.PRODUCTS.GET(id));

    return responseGetAll.data.data;
  } catch (loginError) {
    console.log(loginError)
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

