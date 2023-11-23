import z from 'zod';
import { REQUIRED_MESSAGE } from '@/constants/errors';

export const createSchema = z
  .object({
    nome: z.string().nonempty(REQUIRED_MESSAGE),
    nome_fantasia: z.string().nonempty(REQUIRED_MESSAGE),
    email: z.string().email('Email inválido').nonempty(REQUIRED_MESSAGE),
    password: z.string().optional(),
    data_nascimento_abertura: z.string().optional(),
    plano_id: z.string().nonempty(REQUIRED_MESSAGE),
    logradouro: z.string().nonempty(REQUIRED_MESSAGE),
    cep: z.string().nonempty(REQUIRED_MESSAGE),
    numero: z.string().nonempty(REQUIRED_MESSAGE),
    bairro: z.string().nonempty(REQUIRED_MESSAGE),
    estado: z.string().nonempty(REQUIRED_MESSAGE),
    complemento: z.string().optional(),
    cidade: z.string().nonempty(REQUIRED_MESSAGE),
    nome_loja_2: z.string().optional(),
    nome_loja_3: z.string().optional(),
    telefone: z
      .string()
      .min(10, { message: 'Telefone precisa ter no mínimo 10 caracteres' })
      .max(11, { message: 'Telefone precisa ter no máximo 11 caracteres' }),
    cpf: z
      .string()
      .min(11, { message: 'Precisa ter no mínimo 11 caracteres' })
      .nonempty(REQUIRED_MESSAGE),
  })
