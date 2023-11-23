import type { AxiosError } from 'axios';

type ErrorMessage = Record<
  number,
  {
    status: number;
    message: string;
  }
>;

const errors: ErrorMessage = {
  401: {
    status: 401,
    message: 'Sessão invalida, faça login novamente',
  },
  403: {
    status: 403,
    message: 'Credenciais invalidas, verifique e tente novamente',
  },
  404: {
    status: 404,
    message: 'Dados incorretos, tente novamente',
  },
};

export const handleErrorMessage = ({
  axiosError,
  customErrors = {},
}: {
  axiosError: AxiosError;
  customErrors?: ErrorMessage;
}) => {
  return (
    { ...errors, ...customErrors }[axiosError.response?.status as number] || {
      status: axiosError.response?.status,
      message:
        (axiosError.response?.data as { message: string })?.message || '',
    }
  );
};
