import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiService } from '@/services/api';

type CreateCreditCardParams = CreditCardData & {
  entity_id: string;
  card: {
    cardNumber: string;
    brand: string;
    cvv: string;
    expirationMonth: string;
    expirationYear: string;
  };
};
type getInstallmentsParams = {
  amount: number;
  maxInstallmentNoInterest?: number;
  brand: string;
};

type getBrandParams = {
  cardBin: number;
};

type CancelTransactionParams = {
  type: 'reservation' | 'activity';
  id: string;
};

type SessionTypeParams = {
  type: PagseguroPaymentType;
  // gateway_id: number;
};

type usePagseguroResponse = {
  setSenderHash: () => void;
  createBankSlip: (entity_id: string) => Promise<string>;
  createCreditCard: (params: CreateCreditCardParams) => Promise<void>;
  createPix: (
    createPixData: PaymentRequestApi
  ) => Promise<PagseguroCreatePixResponse>;
  cancelTransaction: (
    params: CancelTransactionParams
  ) => Promise<PagseguroCancelTransactionResponse>;
  getPaymentMethods: () => Promise<PagseguroPaymentMethods>;
  getInstallments: (
    params: getInstallmentsParams
  ) => Promise<PagseguroInstallments>;
  getBrand: (params: getBrandParams) => Promise<PagseguroBrand>;
  setType: React.Dispatch<React.SetStateAction<SessionTypeParams | undefined>>;
  isLoadingSession: boolean;
};

export default function usePagseguro(): usePagseguroResponse {
  const [hash, setHash] = useState('');
  const cardToken = useRef<string>('');
  const [type, setType] = useState<SessionTypeParams>();
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const getSessionId = useCallback(async () => {
    const session = await ApiService.Pagseguro.getSession();
    return session.session;
  }, []);

  const setSession = useCallback(async () => {
    try {
      const session = await getSessionId();
      if (!session) return;
      window.PagSeguroDirectPayment.setSessionId(session);
      setIsLoadingSession(false);
    } catch (error) {
      setIsLoadingSession(false);
    }
  }, [getSessionId]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      process.env.NEXT_PUBLIC_PAGSEGURO_LIB_URL ||
      'https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js';
    script.async = true;
    document.body.appendChild(script);
    script.addEventListener('load', setSession);

    return () => {
      document.body.removeChild(script);
    };
  }, [setSession]);

  const setSenderHash = useCallback(() => {
    window.PagSeguroDirectPayment?.onSenderHashReady((response) => {
      if (response?.status === 'error') {
        globalThis.console.log('hash erro:', response);
        return false;
      }
      const hashResponse = response?.senderHash;
      setHash(hashResponse);
    });
  }, []);

  const createBankSlip = async (entity_id: string): Promise<string> => {
    if (!type) {
      throw new Error('Selecione o tipo Split ou Default');
    }
    const createBankSlipResponse = await ApiService.Pagseguro.createBankSlip({
      type: type.type,
      hash: hash,
      entity_id,
    });
    return createBankSlipResponse.link;
  };
  const createCreditCard = async ({
    entity_id,
    otherOwnership,
    card,
    billingAddress,
    holder,
    installment,
  }: CreateCreditCardParams) => {
    if (!type) {
      throw new Error('Selecione o tipo Split ou Default');
    }
    if (!hash) {
      setSenderHash();
    }
    await new Promise((resolve, reject) => {
      window.PagSeguroDirectPayment.createCardToken({
        ...card,
        success: (response) => {
          cardToken.current = response.card.token;
          resolve(true);
        },
        error: (error) => {
          reject(error);
        },
      });
    }).catch((error) => {
      throw new Object({
        message: 'Número do Cartão inválido',
      });
    });
    if (!hash) {
      setSenderHash();
      throw new Object({
        message: 'Pagamento indisponível. Tente mais tarde!',
      });
    }
    await ApiService.Pagseguro.createCreditCard({
      type: type.type,
      hash: hash,
      otherOwnership,
      cardToken: cardToken.current,
      entity_id,
      billingAddress,
      holder,
      installment,
    });
  };
  const createPix = async (createPixData: PaymentRequestApi) => {
    const createPixResponse = await ApiService.Pagseguro.createPix({
      ...createPixData,
    });
    return createPixResponse;
  };

  const cancelTransaction = async ({
    type,
    id,
  }: CancelTransactionParams): Promise<PagseguroCancelTransactionResponse> => {
    const cancelResponse = await ApiService.Pagseguro.cancelTransaction({
      type,
      id,
    });
    return cancelResponse;
  };

  const getPaymentMethods = async (): Promise<PagseguroPaymentMethods> => {
    const paymentMethods: PagseguroPaymentMethods = await new Promise(
      (resolve, reject) => {
        window.PagSeguroDirectPayment.getPaymentMethods({
          success: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
      }
    );
    return paymentMethods;
  };

  const getBrand = async (params: getBrandParams): Promise<PagseguroBrand> => {
    const brand: PagseguroBrand = await new Promise((resolve, reject) => {
      window.PagSeguroDirectPayment.getBrand({
        ...params,
        success: (response) => {
          resolve(response);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
    return brand;
  };

  const getInstallments = async (
    params: getInstallmentsParams
  ): Promise<PagseguroInstallments> => {
    const installments: PagseguroInstallments = await new Promise(
      (resolve, reject) => {
        window.PagSeguroDirectPayment.getInstallments({
          ...params,
          success: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
      }
    );
    return installments;
  };

  return {
    setSenderHash,
    createBankSlip,
    createCreditCard,
    createPix,
    cancelTransaction,
    setType,
    getPaymentMethods,
    getBrand,
    getInstallments,
    isLoadingSession,
  };
}
