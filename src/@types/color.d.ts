type ColorResponseApi = {
  id: number;
  nome: string;
  hex_code: string;
  product_id?: string;
  product?: ProductResponseApi;
};
type ColorRequestApi = {
  id: number;
  nome: string;
  hex_code: string;
  product_id?: string;

};
