type ApiUserRequestApi = {
  user_id?: number;
  api_id: number;
  credentials: any;
};
type ApiUserResponseApi = {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  periodo: number;
  preco: number;
};
