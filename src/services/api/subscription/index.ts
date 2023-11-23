import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';

export const getAll = async () => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.SUBSCRIPTIONS.GET_ALL);
    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const getMyPlan = async (): Promise<SubscriptionResponseApi> => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.SUBSCRIPTIONS.GET_MY_PLAN);
    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const get = async ({ id }: { id: string }) => {
  try {
    const responseGetAll = await apiInstance.get(
      ENDPOINTS.SUBSCRIPTIONS.GET(id)
    );

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const create = async ({ plano_id, user_id }: SubscriptionRequestApi) => {
  try {
    const responseGetAll = await apiInstance.post(
      ENDPOINTS.SUBSCRIPTIONS.CREATE,
      {
        plano_id,
        user_id,
      }
    );

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
