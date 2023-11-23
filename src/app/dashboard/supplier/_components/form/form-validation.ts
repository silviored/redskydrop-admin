import z from 'zod';
import { REQUIRED_MESSAGE } from '@/constants/errors';

export const createSchema = z
  .object({
    nome: z.string().nonempty(REQUIRED_MESSAGE),
    telefone: z.string().nonempty(REQUIRED_MESSAGE),
    ativado: z.string().nonempty(REQUIRED_MESSAGE),
  })
