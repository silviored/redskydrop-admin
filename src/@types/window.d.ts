export {};
declare global {
  interface Window {
    PagSeguroDirectPayment: {
      setSessionId: (session: string) => void;
      onSenderHashReady: (response: (response) => false | undefined) => void;
      getPaymentMethods: (params: {
        success: (response: PagseguroPaymentMethods) => void;
        error?: (response) => void;
        complete?: (response) => void;
      }) => void;
      getBrand: (params: {
        cardBin: number;
        success: (response: PagseguroBrand) => void;
        error?: (response) => void;
        complete?: (response) => void;
      }) => void;
      getInstallments: (params: {
        amount: number;
        maxInstallmentNoInterest?: number;
        brand: string;
        success: (response: PagseguroInstallments) => void;
        error?: (response) => void;
        complete?: (response) => void;
      }) => void;
      createCardToken: (params: {
        cardNumber: string;
        brand: string;
        cvv: string;
        expirationMonth: string;
        expirationYear: string;
        success: (response) => void;
        error?: (response) => void;
        complete?: (response) => void;
      }) => void;
    };
  }
}
