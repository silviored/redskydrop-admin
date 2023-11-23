export const DEFAULT_GENDER = {
  masculine: 'Masculino',
  feminine: 'Feminino',
};
export const SITUATIONS_PRODUCT = {
  active: 'Ativado',
  inactive: 'Desativado',
};
export const ORDER_SITUATIONS: Record<string, string> = {
  paid: 'Pago',
  awaiting_payment: 'Aguardando pagamento',
  canceled: 'Cancelado',
};
export const CONDITIONS_PRODUCT = {
  new: 'Novo',
  used: 'Usado',
  semi_new: 'Semi novo',
};
export const UNIT_MEASUREMENT_PRODUCT = {
  meters: 'Metros',
  centimeters: 'Centímetros',
};
export const SITUATIONS_USER = {
  1: 'Sim',
  0: 'Não',
};

export const DEFAULT_YES_NOT_OPTIONS: { label: string; value: number }[] =
 [
  {
    label: 'Sim',
    value: 1
  },
  {
    label: 'Não',
    value: 0
  },
 ]
console.log(Object.entries(SITUATIONS_USER))
export const SITUATIONS_USER_OPTIONS: { label: string; value: string }[] =
  Object.entries(SITUATIONS_USER).map(([key, value]) => ({
    label: value,
    value: key,
  })).sort((a, b) => Number(b.value) - Number(a.value));

export const SITUATIONS_PRODUCT_OPTIONS: { label: string; value: string }[] =
  Object.entries(SITUATIONS_PRODUCT).map(([key, value]) => ({
    label: value,
    value: key,
  }));

export const ORDER_SITUATIONS_OPTIONS: { label: string; value: string }[] =
  Object.entries(ORDER_SITUATIONS).map(([key, value]) => ({
    label: value,
    value: key,
  }));

export const UNIT_MEASUREMENT_PRODUCT_OPTIONS: { label: string; value: string }[] =
  Object.entries(UNIT_MEASUREMENT_PRODUCT).map(([key, value]) => ({
    label: value,
    value: key,
  }));
export const CONDITIONS_PRODUCT_OPTIONS: { label: string; value: string }[] =
  Object.entries(CONDITIONS_PRODUCT).map(([key, value]) => ({
    label: value,
    value: key,
  }));

export const GENDER_OPTIONS: { label: string; value: string }[] =
  Object.entries(DEFAULT_GENDER).map(([key, value]) => ({
    label: value,
    value: key,
  }));

export const SUBSCRIPTION_STATUS_TRANSLATED: Record<SubscriptionStatus, string> = {
  'ativo': 'Ativo',
  'cancelado': 'Cancelado',
  'expirado': 'Expirado',
  'em_aberto': 'Em aberto'
}