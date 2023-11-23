type PaymentRequestApi = {
  nome: string;
  cpf: string;
  cell_phone: string;
  email: string;
  id_venda?: number;
  item: {
    nome: string;
    quantity: string;
    unit_amount: string;
  };
};
type PaymentResponseApi = {
  id: number
  data_pagamento: string
  valor: string
  criado_em: string
};
