import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';

export const getSession = async (): Promise<PagseguroGetSessionResponse> => {
  try {
    const creationResponse = await apiInstance.get<PagseguroGetSessionResponse>(
      ENDPOINTS.PAGSEGURO_RESERVATION.GET_SESSION
    );

    return creationResponse.data;
  } catch (creationError) {
    const axiosError = creationError as AxiosError;

    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const createBankSlip = async (
  transaction: PagseguroCreateBankSlipRequest
): Promise<PagseguroCreateBankSlipResponse> => {
  try {
    const creationResponse =
      await apiInstance.post<PagseguroCreateBankSlipResponse>(
        ENDPOINTS.PAGSEGURO_RESERVATION.CREATE_BANK_SLIP,
        transaction
      );

    return creationResponse.data;
  } catch (creationError) {
    const axiosError = creationError as AxiosError;

    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const createCreditCard = async (
  transaction: PagseguroCreateCreditCardRequest
): Promise<PagseguroCreateCreditCardResponse> => {
  try {
    const creationResponse =
      await apiInstance.post<PagseguroCreateCreditCardResponse>(
        ENDPOINTS.PAGSEGURO_RESERVATION.CREATE_CREDIT_CARD,
        transaction
      );

    return creationResponse.data;
  } catch (creationError) {
    const axiosError = creationError as AxiosError;

    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const createPix = async (
  transaction?: PaymentRequestApi
): Promise<PagseguroCreatePixResponse> => {
  try {
    const creationResponse = await apiInstance.post<{data: PagseguroCreatePixResponse}>(
      ENDPOINTS.PAGSEGURO_RESERVATION.CREATE_CREDIT_PIX,
      transaction
    );

    return creationResponse.data.data;
  } catch (creationError) {
    const axiosError = creationError as AxiosError;

    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

export const cancelTransaction = async (
  transaction: PagseguroCancelTransactionRequest
): Promise<PagseguroCancelTransactionResponse> => {
  try {
    const creationResponse =
      await apiInstance.post<PagseguroCancelTransactionResponse>(
        ENDPOINTS.PAGSEGURO_RESERVATION.CANCEL_TRANSACTION,
        transaction
      );

    return creationResponse.data;
  } catch (creationError) {
    const axiosError = creationError as AxiosError;

    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
