import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';

export const getAll = async (params?: PaginationRequestApi) => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.STATUS.GET_ALL, {
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
    const responseGetAll = await apiInstance.get(ENDPOINTS.STATUS.GET(id));

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const create = async (data: StatusRequestApi) => {
  try {
    const responseGetAll = await apiInstance.post(ENDPOINTS.STATUS.CREATE, {...data, ativo: Number(data.ativo)});

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const update = async (data: StatusRequestApi & { id: number}) => {
  try {
    const responseGetAll = await apiInstance.put(ENDPOINTS.STATUS.UPDATE(data.id.toString()), {...data, ativo: Number(data.ativo)});

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
