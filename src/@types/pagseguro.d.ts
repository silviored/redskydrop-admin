type PagseguroPaymentType = 'default' | 'split';

type PagseguroGetSessionRequest = {
  type: PagseguroPaymentType;
};
type PagseguroGetSessionResponse = {
  session: string;
};

type PagseguroCreateBankSlipRequest = {
  type: PagseguroPaymentType;
  entity_id?: string;
  hash: string;
};
type PagseguroCreateBankSlipResponse = {
  link: string;
};

type CreditCardData = {
  otherOwnership: boolean;
  installment?: {
    quantity: string;
    value: number;
    total: number;
  };
  holder?: {
    name: string;
    documents: {
      document: {
        type: string;
        value: string;
      };
    };
    birthDate?: string;
    phone?: {
      areaCode: string;
      number: string;
    };
  };
  billingAddress?: {
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
};
type PagseguroCreateCreditCardRequest = CreditCardData & {
  type: PagseguroPaymentType;
  entity_id?: string;
  hash: string;
  cardToken?: string;
};
type PagseguroCreateCreditCardResponse = {
  entity_id?: string;
  link: string;
  cardToken: string;
};

type PagseguroCreatePixRequest = {
  entity_id?: string;
  id?: string;
};
type PagseguroCreatePixResponse = {
  qr_codes: {
    id: string;
    links: {
      href: string;
    }[];
    text: string;
  }[];
};

type PagseguroCancelTransactionRequest = {
  type?: string;
  id: string;
};
type PagseguroCancelTransactionResponse = {
  transactionCodesToCancel: string[];
  transactionCodesToRefund: string[];
};

type PagseguroPaymentMethods = {
  error: boolean;
  paymentMethods: {
    BOLETO: {
      name: string;
      options: {
        BOLETO: {
          name: string;
          displayName: string;
          status: string;
          code: number;
          images: {
            SMALL: {
              size: string;
              path: string;
            };
            MEDIUM: {
              size: string;
              path: string;
            };
          };
        };
      };
      code: number;
    };
    ONLINE_DEBIT: {
      name: string;
      options: {
        BANCO_BRASIL: {
          name: string;
          displayName: string;
          status: string;
          code: number;
          images: {
            SMALL: {
              size: string;
              path: string;
            };
            MEDIUM: {
              size: string;
              path: string;
            };
          };
        };
      };
      code: number;
    };
    CREDIT_CARD: {
      name: string;
      options: {
        MASTERCARD: {
          name: string;
          displayName: string;
          status: string;
          code: number;
          images: {
            SMALL: {
              size: string;
              path: string;
            };
            MEDIUM: {
              size: string;
              path: string;
            };
          };
        };
      };
      code: number;
    };
  };
};

type PagseguroInstallments = {
  error: boolean;
  installments: {
    [key: string]: {
      quantity: 1;
      totalAmount: 100;
      installmentAmount: 100;
      interestFree: true;
    }[];
  };
};

type PagseguroBrand = {
  brand: {
    name: string;
  };
  reasonMessage: string | null;
  statusMessage: string;
  validationAlgorithm: string;
};
