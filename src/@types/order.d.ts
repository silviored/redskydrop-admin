type OrderResponseApi = {
  id: number;
  id_user: number;
  user: UserEntity;
  preco_total: number;
  tipo_pagamento_id: TipoPagamentoEntity;
  ispago: boolean;
  status: string;
  label_image?: string;
  isreservado: boolean;
  criado_em: Date;
  vendaProdutos: SaleProductResponseApi[]
  pagamentos: PaymentResponseApi[]
  user: UserResponseApi
};
type OrderRequestApi = {
  id: number;
  nome: string;
  descricao: string;
  descricao_curta?: string;
  mais_vendido?: string;
  preco: number | string;
  fotos: any;
  ativado: boolean;
  video?: string;
  categoriaid: string;
  subcategoriaid?: string;
  marcaid?: string;
  ncm: string;
  preco_custo: string;
  preco_compra: string;
  profundidade: string;
  data_validade: string;
  unidade_caixa: string;
  tipo_item: string;
  tributos?: string;
  codigo_pai?: string;
  codigo_integracao?: string;
  cest: string;
  volume: string;
  peso_bruto: string;
  gtin_ean: string;
  gtin_ean_embalagem: string;
  situacao: string;
  condicao: string;
  unidade_medida: string;
  observacao: string;
  informacao_adicional: string;
  produtosVariacoes?: OrderVariantsResponseApi[];
  estado?: string;
  estoque: string;
  estoquemin: string;
  sku: string;
  mais_vendido: boolean;
  largura: number;
  altura: number;
  comprimento: number;
  peso: string;
  tempogarantia: string;
  fornecedorid: string;
};
type FilterProps = {
  start_date?: string | null
  user_id?: string | null
  end_date?: string | null
  status?: string | null
}
