type TutorialResponseApi = {
  id: number;
  nome: string;
  descricao?: string;
  link: string;
};
type TutorialRequestApi = {
  nome: string;
  descricao?: string;
  link: string;
};
