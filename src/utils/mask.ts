export function currencyMask(
  value: string | number,
  settings?: Intl.NumberFormatOptions
): string {
  let newValue = value;
  if (typeof newValue === 'string') {
    newValue = newValue?.replace('.', '').replace(',', '').replace(/\D/g, '');
  }

  const options = { minimumFractionDigits: 2, ...settings };
  const result = new Intl.NumberFormat('pt-BR', options).format(
    typeof newValue === 'string' ? parseFloat(newValue) / 100 : newValue
  );

  return result;
}


export function phoneMask(
  v: string,
  options?: { whitoutDDD?: boolean }
): string {
  if (!v) return ''
  v = v.replace(/[^\d]/g, '')
  if (!options?.whitoutDDD) {
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
  }
  v = v.replace(/(\d)(\d{4})$/, '$1-$2')
  return v
}

export function monetaryToNumber(value: string): number {
  return Number(value?.replaceAll('.', '').replaceAll(',', '.'));
}

export function roundUpperNumber(value: string | number): number {
  return Math.ceil(Number(value));
}

export const cpfCnpjMask = (value: string): string => {
  const isCpf = value.length <= 14;

  return isCpf
    ? value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    : value
        .replace(/\D+/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};
