import axios, { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';

import { handleErrorMessage } from '../errors';
import { stringToBase64 } from '@/utils/base64';

export const getAccessToken = async (data: BlingAccessTokenRequest) => {
  try {
    const responseGetAll = await axios.post(ENDPOINTS.BLING.GET_ALL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${stringToBase64(`${process.env.NEXT_PUBLIC_API_CLIENT_ID_BLING}:${process.env.NEXT_PUBLIC_API_SECRET_BLING}`)}`
      }
    });

    return responseGetAll.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

