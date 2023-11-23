import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';

export const updatePassword = async ({
  userId,
  ...requesBody
}: {
  userId: number;
} & ChangePasswordRequest) => {
  try {
    const responseAuthToken = await apiInstance.put(
      ENDPOINTS.LOGIN.UPDATE_PASSWORD(userId.toString()),
      requesBody
    );

    return responseAuthToken.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const token = async (): Promise<string> => {
  try {
    const responseAuthToken = await apiInstance.get<string>(ENDPOINTS.TOKEN, {
      headers: {
        'public-key': `${process.env.NEXT_PUBLIC_PUBLIC_KEY}`,
      },
    });

    return responseAuthToken.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const signUp = async (createUser: UserRequestApi) => {
  try {
    const signUpResponse = await apiInstance.post<{ data: UserResponseApi }>(
      ENDPOINTS.USERS.CREATE,
      {
        ...createUser,
      }
    );

    return signUpResponse.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const login = async ({
  email,
  password,
  tipo,
}: {
  email: string;
  tipo: string;
  password: string;
}) => {
  try {
    const loginResponse = await apiInstance.post<{ data: LoginApiResponse }>(
      ENDPOINTS.LOGIN.LOGIN,
      {
        email,
        password,
        tipo,
      }
    );

    return loginResponse.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const professorLogin = async ({
  login,
  password,
}: {
  login: string;
  password: string;
}) => {
  try {
    const loginResponse = await apiInstance.post<LoginApiResponse>(
      ENDPOINTS.LOGIN.PROFESSOR,
      {
        email: login,
        password,
      }
    );

    return loginResponse.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const forgotPassword = async ({ document }: { document: string }) => {
  try {
    const loginResponse = await apiInstance.post(
      ENDPOINTS.LOGIN.FORGOT_PASSWORD,
      {
        document,
      }
    );

    return loginResponse.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const resetPassword = async ({
  password,
  passwordConfirmation,
  token,
}: ResetPasswordRequest) => {
  try {
    const resetPasswordResponse = await apiInstance.post(
      ENDPOINTS.LOGIN.RESET_PASSWORD,
      {
        password,
        password_confirmation: passwordConfirmation,
        token,
      }
    );

    return resetPasswordResponse.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
