import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';

export const getAll = async (params?: PaginationRequestApi) => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.BRANDS.GET_ALL, {
      params
    });

    return responseGetAll.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const get = async ({ id }: { id: string }) => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.BRANDS.GET(id));

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const create = async (data: BrandRequestApi) => {
  try {
    const responseGetAll = await apiInstance.post(ENDPOINTS.BRANDS.CREATE, data);

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const update = async (data: BrandRequestApi & { id: number}) => {
  try {
    const responseGetAll = await apiInstance.put(ENDPOINTS.BRANDS.UPDATE(data.id.toString()), data);

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
