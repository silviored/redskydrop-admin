type CategoryResponseApi = {
  id: number;
  parentid: number;
  nome: string;
  descricao: string;
  ativado: boolean;
  ordem: number;
  childCategories: SubCategoryRequest[]
};
type SubCategoryRequest = {
  id?: string;
  nome: string;
  descricao: string;
};
type CategoryRequestApi = {
  parentid: number;
  nome: string;
  descricao: string;
  ativado: boolean;
  ordem: number;
  subCategories: SubCategoryRequest[]
};
