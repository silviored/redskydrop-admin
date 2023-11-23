type UserRequestApi = {
  nome: string;
  email: string;
  password: string;
  password_confirmation?: string;
  password: string;
  tipo?: string;
  ativado?: string;
  token?: string;
  plano_id?: string
  data_nascimento_abertura?: string
  telefone: string;
  responsavel?: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  razao_social?: string;
  cpf: string;
  tipo_plano: string;
  data_inicio: Date;
  acceptedTerms?: string;
  logradouro?: string;
  cep?: string;
  numero?: string;
  bairro?: string;
  estado?: string;
  complemento?: string;
  cidade?: string;
  nome_loja_2?: string;
  nome_loja_3?: string;
  deleted_at?: string;
};
type UserResponseApi = {
  id: number;
  nome: string;
  email: string;
  password: string;
  password_confirmation: string;
  data_nascimento_abertura?: string
  password: string;
  tipo: string;
  ativado: string;
  token?: string;
  accessToken?: string;
  telefone: string;
  responsavel?: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  razao_social?: string;
  cpf: string;
  tipo_plano: string;
  data_inicio: Date;
  acceptedTerms?: string;
  logradouro?: string;
  cep?: string;
  numero?: string;
  bairro?: string;
  estado?: string;
  complemento?: string;
  cidade?: string;
  nome_loja_2?: string;
  nome_loja_3?: string;
  assinaturas?: SubscriptionResponseApi[];
};
type FilterUserReportProps = {
  ativado?: string | null
}
