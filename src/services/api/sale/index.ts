import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';



export const reportDashboard = async (): Promise<ReportDashboardApiResponse> => {
  try {
    const responseGetAll = await apiInstance.post(
      ENDPOINTS.SALES.REPORT_DASHBOARD);
    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const create = async (data: SaleRequestApi) => {
  try {
    const responseGetAll = await apiInstance.post(
      ENDPOINTS.SALES.CREATE, data);
    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const getAll = async (params: SaleRequestGetAllApi) => {
  try {
    const responseGetAll = await apiInstance.get(
      ENDPOINTS.SALES.GET_ALL, {
        params: {...params}
      });
    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const get = async ({ id }: { id: number | string }): Promise<SaleResponseApi> => {
  try {
    const responseGetAll = await apiInstance.get(
      ENDPOINTS.SALES.GET(id.toString()));
    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const verifyStock = async ({ id }: { id: number | string }): Promise<SaleResponseApi> => {
  try {
    const responseGetAll = await apiInstance.get(
      ENDPOINTS.SALES.VERIFY_STOCK(id.toString()));
    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

