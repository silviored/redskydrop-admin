type SaleRequestApi = {
  preco_total: number
  tipo_pagamento_id: number
  products: ProductResponseApi[]
}
type SaleRequestGetAllApi = {
  take: number
  skip: number
  status?: string | null
}
type SaleResponseApi = {
  id: number;
  id_user: number;
  user: UserEntity;
  preco_total: number;
  tipo_pagamento_id: TipoPagamentoEntity;
  ispago: boolean;
  status: number;
  isreservado: boolean;
  criado_em: Date;
  vendaProdutos: SaleProductResponseApi[]
  pagamentos: PaymentResponseApi[]
}

type ReportDashboardApiResponse = {
  pending: string
  paid: string
  cancelled: string
}