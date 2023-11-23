type SubscriptionRequestApi = {
  user_id: number;
  plano_id: number;
};
type SubscriptionResponseApi = {
  id: number;
  user_id: number;
  plano_id: number;
  data_inicio: string;
  data_termino: string;
  status: SubscriptionStatus;  
  pagamento: PaymentResponseApi
  plano: PlanResponseApi
};

type SubscriptionStatus =   'ativo'|
'cancelado'|
'expirado'|
'em_aberto'
